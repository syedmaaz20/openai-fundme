
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import HowItWorks from "./pages/HowItWorks";
import StudentProfile from "./pages/StudentProfile";
import StudentDashboard from "./pages/StudentDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import AdminDashboard from "./pages/AdminDashboard";
import { findCampaignByShareCode } from "@/utils/campaignShortUrl";
import React from "react";

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
            <Route path="/about" element={<About />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Protected Student Routes */}
            <Route 
              path="/student-profile" 
              element={
                <ProtectedRoute requiredUserType="student">
                  <StudentProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute requiredUserType="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Donor Routes */}
            <Route 
              path="/donor-dashboard" 
              element={
                <ProtectedRoute requiredUserType="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donor-profile" 
              element={
                <ProtectedRoute requiredUserType="donor">
                  <DonorProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiredUserType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Share-friendly short campaign route */}
            <Route path="/c/:shareCode" element={<ShortCampaignDetail />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
