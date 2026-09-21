import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import RedePage from "./pages/RedePage.tsx";
// Marketing, Vendas e PIPA ainda não têm dado real: as telas antigas
// (MarketingPage/VendasPage/IAPage) renderizavam números fabricados.
// Ficaram no repositório para quando o dado existir; a rota aponta para
// a página de apresentação do módulo.
import EmBrevePage from "./pages/EmBrevePage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import HelpPage from "./pages/HelpPage.tsx";
import TermosPage from "./pages/TermosPage.tsx";
import PrivacidadePage from "./pages/PrivacidadePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NovaSenhaPage from "./pages/NovaSenhaPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/nova-senha" element={<NovaSenhaPage />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/rede" element={<ProtectedRoute><RedePage /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><EmBrevePage /></ProtectedRoute>} />
            <Route path="/vendas" element={<ProtectedRoute><EmBrevePage /></ProtectedRoute>} />
            <Route path="/ia" element={<ProtectedRoute><EmBrevePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
            {/* Públicas: a tela de entrada aponta para elas antes do login. */}
            <Route path="/termos" element={<TermosPage />} />
            <Route path="/privacidade" element={<PrivacidadePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
