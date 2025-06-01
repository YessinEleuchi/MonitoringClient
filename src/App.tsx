
import { Toaster } from "@/lib/components/ui/toaster";
import { Toaster as Sonner } from "@/lib/components/ui/sonner";
import { TooltipProvider } from "@/lib/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginPage from "@/lib/pages/LoginPage";
import Dashboard from "@/lib/pages/Dashboard";
import ApplicationEndpoints from "@/lib/pages/ApplicationEndpoints";
import EndpointTesting from "@/lib/pages/EndpointTesting";
import ProtectedRoute from "@/lib/components/ProtectedRoute";
import NotFound from "@/lib/pages/NotFound";
import Configuration from "@/lib/pages/Configuration.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/applications/:appId/endpoints" element={
              <ProtectedRoute>
                <ApplicationEndpoints />
              </ProtectedRoute>
            } />
            <Route path="/applications/:appId/endpoints/:endpointId/test" element={
              <ProtectedRoute>
                <EndpointTesting />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
            <Route path="/configuration" element={
              <ProtectedRoute>
                <Configuration />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
