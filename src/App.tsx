import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/layout/Layout";
import HomePage from "./pages/HomePage";
import ChatbotPage from "./pages/ChatbotPage";
import ChatSupportPage from "./pages/ChatSupportPage";
import TicketsPage from "./pages/TicketsPage";
import TroubleshootPage from "./pages/TroubleshootPage";
import AppInstallerPage from "./pages/AppInstallerPage";
import HealthPage from "./pages/HealthPage";
import AdminPortalPage from "./pages/AdminPortalPage";
import AssetManagementPage from "./pages/AssetManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/chat-support" element={<ChatSupportPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/troubleshoot" element={<TroubleshootPage />} />
              <Route path="/app-installer" element={<AppInstallerPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/admin" element={<AdminPortalPage />} />
              <Route path="/assets" element={<AssetManagementPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
