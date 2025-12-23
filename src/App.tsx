import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleRouter } from "@/components/RoleRouter";
import { PanelSwitcher } from "@/components/admin/PanelSwitcher";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Connections from "./pages/Connections";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Guide from "./pages/Guide";
// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminMembers from "./pages/admin/Members";
import AdminEvents from "./pages/admin/Events";
import AdminVenues from "./pages/admin/Venues";
import AdminFeedback from "./pages/admin/Feedback";
import AdminTeam from "./pages/admin/Team";
import MarketIntel from "./pages/admin/MarketIntel";
import AdminShop from "./pages/admin/Shop";
import AdminCoupons from "./pages/admin/Coupons";
import AdminOrders from "./pages/admin/Orders";
// Team pages
import TeamDashboard from "./pages/team/Dashboard";
import TeamEvents from "./pages/team/Events";
import TeamCheckIns from "./pages/team/CheckIns";
import TeamPerformance from "./pages/team/Performance";
// Member pages
import Matches from "./pages/Matches";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RoleRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/events" element={<Events />} />
              <Route path="/guide" element={<Guide />} />
              
              {/* Singles Routes */}
              <Route path="/connections" element={<Connections />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:chatType/:chatId" element={<Messages />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/members" element={<AdminMembers />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/venues" element={<AdminVenues />} />
              <Route path="/admin/feedback" element={<AdminFeedback />} />
              <Route path="/admin/market-intel" element={<MarketIntel />} />
              <Route path="/admin/team" element={<AdminTeam />} />
              <Route path="/admin/shop" element={<AdminShop />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              
              {/* Team Routes */}
              <Route path="/team/dashboard" element={<TeamDashboard />} />
              <Route path="/team/events" element={<TeamEvents />} />
              <Route path="/team/check-ins" element={<TeamCheckIns />} />
              <Route path="/team/performance" element={<TeamPerformance />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PanelSwitcher />
          </RoleRouter>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
