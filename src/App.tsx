import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Connections from "./pages/Connections";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminEvents from "./pages/admin/Events";
import AdminVenues from "./pages/admin/Venues";
import AdminFeedback from "./pages/admin/Feedback";
import AdminTeam from "./pages/admin/Team";
// Team pages
import TeamDashboard from "./pages/team/Dashboard";
import TeamEvents from "./pages/team/Events";
import TeamCheckIns from "./pages/team/CheckIns";
import TeamPerformance from "./pages/team/Performance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/events" element={<Events />} />
            
            {/* Singles Routes */}
            <Route path="/connections" element={<Connections />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/venues" element={<AdminVenues />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/team" element={<AdminTeam />} />
            
            {/* Team Routes */}
            <Route path="/team/dashboard" element={<TeamDashboard />} />
            <Route path="/team/events" element={<TeamEvents />} />
            <Route path="/team/check-ins" element={<TeamCheckIns />} />
            <Route path="/team/performance" element={<TeamPerformance />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
