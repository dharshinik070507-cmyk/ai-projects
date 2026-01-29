import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import Home from "@/pages/Home";
import Grade from "@/pages/Grade";
import History from "@/pages/History";
import ReportDetails from "@/pages/ReportDetails";
import NotFound from "@/pages/not-found";
import LoginButton from "@/components/LoginButton";
<header className="flex justify-between items-center p-4 border-b">
  <h1 className="font-bold text-xl">Agri Grade AI</h1>
  <LoginButton />
</header>

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/grade" component={Grade} />
      <Route path="/history" component={History} />
      <Route path="/reports/:id" component={ReportDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col font-body antialiased">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
