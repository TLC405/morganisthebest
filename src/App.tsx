import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleRouter } from "@/components/RoleRouter";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PanelSwitcher } from "@/components/admin/PanelSwitcher";
import { BrandedSplash } from "@/components/BrandedSplash";

// Lazy-loaded pages
const Landing = lazy(() => import("./pages/Landing"));
const Social = lazy(() => import("./pages/Social"));
const Auth = lazy(() => import("./pages/Auth"));
const Explore = lazy(() => import("./pages/Explore"));
const Events = lazy(() => import("./pages/Events"));
const Profile = lazy(() => import("./pages/Profile"));
const Matches = lazy(() => import("./pages/Matches"));
const Chats = lazy(() => import("./pages/Chats"));
const Chat = lazy(() => import("./pages/Chat"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const Quiz = lazy(() => import("./pages/Quiz"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
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

// Team pages
const TeamDashboard = lazy(() => import("./pages/team/Dashboard"));
const TeamEvents = lazy(() => import("./pages/team/Events"));
const TeamCheckIns = lazy(() => import("./pages/team/CheckIns"));
const TeamPerformance = lazy(() => import("./pages/team/Performance"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <RoleRouter>
          <Suspense fallback={<BrandedSplash />}>
            <Routes>
              {/* Auth-first: root = login */}
              <Route path="/" element={<Auth />} />
              
              {/* About / Marketing page */}
              <Route path="/about" element={<Social />} />
              
              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Explore - Main hub after login */}
              <Route path="/explore" element={<Explore />} />
              
              {/* Core Routes (5 main tabs) */}
              <Route path="/events" element={<Events />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chat/:conversationId" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Secondary Routes */}
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/quiz" element={<Quiz />} />
              
              {/* Legacy redirects */}
              <Route path="/social" element={<Navigate to="/about" replace />} />
              <Route path="/dashboard" element={<Navigate to="/explore" replace />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>
              } />
              <Route path="/admin/members" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminMembers /></ProtectedRoute>
              } />
              <Route path="/admin/events" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminEvents /></ProtectedRoute>
              } />
              <Route path="/admin/venues" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminVenues /></ProtectedRoute>
              } />
              <Route path="/admin/feedback" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminFeedback /></ProtectedRoute>
              } />
              <Route path="/admin/market-intel" element={
                <ProtectedRoute allowedRoles={['admin']}><MarketIntel /></ProtectedRoute>
              } />
              <Route path="/admin/team" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminTeam /></ProtectedRoute>
              } />
              <Route path="/admin/shop" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminShop /></ProtectedRoute>
              } />
              <Route path="/admin/coupons" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminCoupons /></ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>
              } />
              
              {/* Team Routes */}
              <Route path="/team/dashboard" element={
                <ProtectedRoute allowedRoles={['team', 'admin']}><TeamDashboard /></ProtectedRoute>
              } />
              <Route path="/team/events" element={
                <ProtectedRoute allowedRoles={['team', 'admin']}><TeamEvents /></ProtectedRoute>
              } />
              <Route path="/team/check-ins" element={
                <ProtectedRoute allowedRoles={['team', 'admin']}><TeamCheckIns /></ProtectedRoute>
              } />
              <Route path="/team/performance" element={
                <ProtectedRoute allowedRoles={['team', 'admin']}><TeamPerformance /></ProtectedRoute>
              } />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <PanelSwitcher />
        </RoleRouter>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
