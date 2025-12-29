import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleRouter } from "@/components/RoleRouter";
import { PanelSwitcher } from "@/components/admin/PanelSwitcher";
import { InstallPrompt } from "@/components/InstallPrompt";
import { lazy, Suspense } from "react";

// Eager load critical pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";

// Lazy load less critical pages
const Connections = lazy(() => import("./pages/Connections"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Messages = lazy(() => import("./pages/Messages"));
const Guide = lazy(() => import("./pages/Guide"));
const Matches = lazy(() => import("./pages/Matches"));
const Offline = lazy(() => import("./pages/Offline"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminMembers = lazy(() => import("./pages/admin/Members"));
const AdminEvents = lazy(() => import("./pages/admin/Events"));
const AdminVenues = lazy(() => import("./pages/admin/Venues"));
const AdminFeedback = lazy(() => import("./pages/admin/Feedback"));
const AdminTeam = lazy(() => import("./pages/admin/Team"));
const MarketIntel = lazy(() => import("./pages/admin/MarketIntel"));
const AdminShop = lazy(() => import("./pages/admin/Shop"));
const AdminCoupons = lazy(() => import("./pages/admin/Coupons"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));

// Lazy load team pages
const TeamDashboard = lazy(() => import("./pages/team/Dashboard"));
const TeamEvents = lazy(() => import("./pages/team/Events"));
const TeamCheckIns = lazy(() => import("./pages/team/CheckIns"));
const TeamPerformance = lazy(() => import("./pages/team/Performance"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RoleRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/events" element={<Events />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/offline" element={<Offline />} />
                
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
            </Suspense>
            <PanelSwitcher />
            <InstallPrompt />
          </RoleRouter>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
