# EduRespond - Teacher Automation Platform

A full-stack web application designed to automate teacher communication workflows using AI-powered response generation.

## Features

- **Multi-language AI Response Generation**: Generate professional responses using Google Gemini AI
- **Language Support**: English, Spanish, French, German, Chinese
- **Template Management**: Save and reuse frequently used responses
- **Analytics Dashboard**: Track response metrics and language usage
- **Response History**: View and manage all generated responses
- **Real-time Activity Tracking**: Monitor system usage and activities

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: shadcn/ui + Tailwind CSS
- **AI Integration**: Google Gemini API
- **State Management**: TanStack Query

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd edurespond
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/edurespond
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### 3. Database Setup

```bash
# Push database schema
npm run db:push
```

### 4. Start Development Server

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend & Backend: `http://localhost:5000`

## VS Code Setup

### Recommended Extensions

Install these VS Code extensions for the best development experience:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── services/          # Business logic
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database layer
│   └── db.ts             # Database connection
├── shared/                # Shared types/schemas
│   └── schema.ts         # Drizzle schema
└── package.json
```

## API Endpoints

- `GET /api/dashboard/stats` - Dashboard analytics
- `GET /api/responses` - List responses
- `POST /api/responses` - Generate new response
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `GET /api/activities` - List activities

## Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run check

# Database operations
npm run db:push        # Push schema changes
npm run db:studio      # Open Drizzle Studio

# Build for production
npm run build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Deployment

The application is configured for deployment on Replit or any Node.js hosting platform:

1. Set environment variables
2. Run `npm run build`
3. Start with `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

MIT License - see LICENSE file for details