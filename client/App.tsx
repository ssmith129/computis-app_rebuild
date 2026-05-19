import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Wallets from "./pages/Wallets";
import Clients from "./pages/Clients";
import RuleEngine from "./pages/RuleEngine";
import Exports from "./pages/Exports";
import WalletIngestion from "./pages/WalletIngestion";
import DataAnomalyDetection from "./pages/DataAnomalyDetection";
import Irs8949 from "./pages/Irs8949";
import GainLoss from "./pages/GainLoss";
import Settings from "./pages/Settings";
import Preferences from "./pages/Preferences";
import MyAccount from "./pages/MyAccount";
import HelpPage from "./pages/HelpPage";
import KeyboardShortcuts from "./pages/KeyboardShortcuts";
import DesignSystemShowcase from "./pages/DesignSystemShowcase";
import RenderClassificationInsights from "./pages/RenderClassificationInsights";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route
            path="/data-anomaly-detection"
            element={<DataAnomalyDetection />}
          />
          <Route path="/wallets" element={<Wallets />} />
          <Route path="/wallet-ingestion" element={<WalletIngestion />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/irs-8949" element={<Irs8949 />} />
          <Route path="/gain-loss" element={<GainLoss />} />
          <Route path="/exports" element={<Exports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/rule-engine" element={<RuleEngine />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/keyboard-shortcuts" element={<KeyboardShortcuts />} />
          <Route path="/design-system" element={<DesignSystemShowcase />} />
          <Route
            path="/_render/classification-insights"
            element={<RenderClassificationInsights />}
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
