import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  const existingUser = await storage.getUserByUsername(claims["sub"]);
  if (existingUser) {
    return existingUser;
  }
  
  return await storage.createUser({
    username: claims["sub"],
    password: "oauth", // Not used for OAuth
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    role: "teacher",
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // For development, we'll use simple session-based auth
  if (process.env.NODE_ENV === "development") {
    // Simple login endpoint for development
    app.post("/api/login", async (req, res) => {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (user && user.password === password) {
        (req as any).user = user;
        res.json({ user: { id: user.id, username: user.username, email: user.email } });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    });

    app.post("/api/logout", (req, res) => {
      (req as any).user = null;
      res.json({ message: "Logged out successfully" });
    });

    app.get("/api/auth/user", (req, res) => {
      const user = (req as any).user;
      if (user) {
        res.json({ id: user.id, username: user.username, email: user.email });
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    });
  }

  // Try to setup Replit Auth if in production
  if (process.env.REPLIT_DOMAINS && process.env.NODE_ENV === "production") {
    try {
      const config = await getOidcConfig();

      const verify: VerifyFunction = async (
        tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
        verified: passport.AuthenticateCallback
      ) => {
        const user = {};
        updateUserSession(user, tokens);
        await upsertUser(tokens.claims());
        verified(null, user);
      };

      for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
        const strategy = new Strategy(
          {
            name: `replitauth:${domain}`,
            config,
            scope: "openid email profile offline_access",
            callbackURL: `https://${domain}/api/callback`,
          },
          verify,
        );
        passport.use(strategy);
      }

      passport.serializeUser((user: Express.User, cb) => cb(null, user));
      passport.deserializeUser((user: Express.User, cb) => cb(null, user));

      app.get("/api/login", (req, res, next) => {
        passport.authenticate(`replitauth:${req.hostname}`, {
          prompt: "login consent",
          scope: ["openid", "email", "profile", "offline_access"],
        })(req, res, next);
      });

      app.get("/api/callback", (req, res, next) => {
        passport.authenticate(`replitauth:${req.hostname}`, {
          successReturnToOrRedirect: "/",
          failureRedirect: "/api/login",
        })(req, res, next);
      });

      app.get("/api/logout", (req, res) => {
        req.logout(() => {
          res.redirect(
            client.buildEndSessionUrl(config, {
              client_id: process.env.REPL_ID!,
              post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
            }).href
          );
        });
      });
    } catch (error) {
      console.log("Replit Auth not available, using simple auth");
    }
  }
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For development, check simple session
  if (process.env.NODE_ENV === "development") {
    const user = (req as any).user;
    if (user) {
      return next();
    }
    return res.status(401).json({ message: "Authentication required" });
  }

  // For production, use Replit Auth
  const user = req.user as any;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export const getCurrentUser = (req: any) => {
  if (process.env.NODE_ENV === "development") {
    return req.user;
  }
  return req.user?.claims ? { id: req.user.claims.sub } : null;
};