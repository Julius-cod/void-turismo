import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/contexts/ApiAuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";


// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Bookings from "./pages/Bookings";
import Stays from "./pages/Stays";
import StayDetail from "./pages/StayDetail";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import Cities from "./pages/Cities";
import Destination from "./pages/Destination";
import Discover from "./pages/Discover";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDestinations from "./pages/admin/Destinations";
import AdminAccommodations from "./pages/admin/Accommodations";
import AdminExperiences from "./pages/admin/Experiences";
import AdminBookings from "./pages/admin/Bookings";
import AdminUsers from "./pages/admin/Users";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/accommodations" element={<Stays />} />
                <Route path="/accommodations/:slug" element={<StayDetail />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route path="/experiences/:slug" element={<ExperienceDetail />} />
                <Route path="/cities" element={<Cities />} />
                <Route path="/destinations/:slug" element={<Destination />} />
                <Route path="/about" element={<About />} />

                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/destinations"
                  element={
                    <AdminRoute>
                      <AdminDestinations />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/accommodations"
                  element={
                    <AdminRoute>
                      <AdminAccommodations />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/experiences"
                  element={
                    <AdminRoute>
                      <AdminExperiences />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <AdminRoute>
                      <AdminBookings />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />

              

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
