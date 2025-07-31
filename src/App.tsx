import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PanditDashboard from "./pages/PanditDashboard";
import Shop from "./pages/Shop";
import BookPandit from "./pages/BookPandit";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requireUser>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/pandit-dashboard" element={
              <ProtectedRoute requirePandit>
                <PanditDashboard />
              </ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute requireUser>
                <Shop />
              </ProtectedRoute>
            } />
            <Route path="/book-pandit" element={
              <ProtectedRoute requireUser>
                <BookPandit />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute requireUser>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
