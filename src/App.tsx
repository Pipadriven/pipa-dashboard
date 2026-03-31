import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import MarketingPage from "./pages/MarketingPage.tsx";
import VendasPage from "./pages/VendasPage.tsx";
import IAPage from "./pages/IAPage.tsx";
import PlaceholderPage from "./pages/PlaceholderPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
            <Route path="/vendas" element={<ProtectedRoute><VendasPage /></ProtectedRoute>} />
            <Route path="/ia" element={<ProtectedRoute><IAPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><PlaceholderPage /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><PlaceholderPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
