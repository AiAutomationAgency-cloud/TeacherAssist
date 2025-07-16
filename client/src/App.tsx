import { Switch, Route } from "wouter";
import HomeSimple from "@/pages/home-simple";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeSimple} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Router />
    </div>
  );
}

export default App;