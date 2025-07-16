import { Switch, Route } from "wouter";
import HomeSimple from "@/pages/home-simple";
import DashboardSimple from "@/pages/dashboard-simple";
import LoginSimple from "@/pages/login-simple";
import NotFoundSimple from "@/pages/not-found-simple";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeSimple} />
      <Route path="/dashboard" component={DashboardSimple} />
      <Route path="/login" component={LoginSimple} />
      <Route component={NotFoundSimple} />
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