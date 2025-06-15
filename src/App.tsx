import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import HowItWorks from "./pages/HowItWorks";
import React from "react";
const queryClient = new QueryClient();

import { useFindCampaignByShareCode } from "@/utils/campaignShortUrl";
import { useParams } from "react-router-dom";
import TopNav from "@/components/TopNav";

const ShortCampaignDetail = () => {
  const { shareCode } = useParams();
  const { data: campaign, isLoading, error } = useFindCampaignByShareCode(shareCode || "");

  if (isLoading) {
    return (
      <div>
        <TopNav />
        <div className="h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return <NotFound />;
  }

  return <CampaignDetail campaign={campaign} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* NEW: Share-friendly short campaign route */}
          <Route path="/c/:shareCode" element={<ShortCampaignDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
