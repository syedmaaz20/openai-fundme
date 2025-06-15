
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import HowItWorks from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import { findCampaignByShareCode } from "@/utils/campaignShortUrl";

const queryClient = new QueryClient();

const ShortCampaignDetail = () => {
  const { shareCode } = window.location.pathname.match(/^\/c\/(?<shareCode>[^/]+)/)?.groups || {};
  const campaign = shareCode ? findCampaignByShareCode(shareCode) : undefined;
  if (!campaign) return <NotFound />;
  return <CampaignDetail campaign={campaign} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/c/:shareCode" element={<ShortCampaignDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
