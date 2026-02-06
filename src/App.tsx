import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleRouter } from "@/components/RoleRouter";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PanelSwitcher } from "@/components/admin/PanelSwitcher";

// Pages
import Landing from "./pages/Landing";
import Social from "./pages/Social";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Matches from "./pages/Matches";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";
import CheckIn from "./pages/CheckIn";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";

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
            {/* Landing - Brutalist entry */}
            <Route path="/" element={<Landing />} />
            
            {/* Social Hub - Main app home */}
            <Route path="/social" element={<Social />} />
            
            {/* Auth */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Core Singles Routes (4 main tabs) */}
            <Route path="/events" element={<Events />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:conversationId" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Secondary Singles Routes */}
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/quiz" element={<Quiz />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/members" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMembers />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminEvents />
              </ProtectedRoute>
            } />
            <Route path="/admin/venues" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminVenues />
              </ProtectedRoute>
            } />
            <Route path="/admin/feedback" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFeedback />
              </ProtectedRoute>
            } />
            <Route path="/admin/market-intel" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MarketIntel />
              </ProtectedRoute>
            } />
            <Route path="/admin/team" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminTeam />
              </ProtectedRoute>
            } />
            <Route path="/admin/shop" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminShop />
              </ProtectedRoute>
            } />
            <Route path="/admin/coupons" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCoupons />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrders />
              </ProtectedRoute>
            } />
            
            {/* Team Routes */}
            <Route path="/team/dashboard" element={
              <ProtectedRoute allowedRoles={['team', 'admin']}>
                <TeamDashboard />
              </ProtectedRoute>
            } />
            <Route path="/team/events" element={
              <ProtectedRoute allowedRoles={['team', 'admin']}>
                <TeamEvents />
              </ProtectedRoute>
            } />
            <Route path="/team/check-ins" element={
              <ProtectedRoute allowedRoles={['team', 'admin']}>
                <TeamCheckIns />
              </ProtectedRoute>
            } />
            <Route path="/team/performance" element={
              <ProtectedRoute allowedRoles={['team', 'admin']}>
                <TeamPerformance />
              </ProtectedRoute>
            } />
            
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
