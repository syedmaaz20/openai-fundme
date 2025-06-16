import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { supabase } from "@/lib/supabase";
import StickyDonationCard from "@/components/StickyDonationCard";
import { toast } from "@/hooks/use-toast";
import ProfileCard from "@/components/campaign-detail/ProfileCard";
import WhyINeedSupport from "@/components/campaign-detail/WhyINeedSupport";
import EducationPath from "@/components/campaign-detail/EducationPath";
import FundingNeeds from "@/components/campaign-detail/FundingNeeds";
import ProgressTracker from "@/components/campaign-detail/ProgressTracker";
import ImpactTracker from "@/components/campaign-detail/ImpactTracker";
import WordsOfSupport from "@/components/campaign-detail/WordsOfSupport";
import DonationOptions from "@/components/campaign-detail/DonationOptions";
import CampaignFooter from "@/components/campaign-detail/CampaignFooter";
import { Loader2 } from "lucide-react";
import type { Campaign } from "@/types/campaign";

const CampaignDetail = ({ campaign: campaignOverride }: { campaign?: Campaign } = {}) => {
  const params = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(campaignOverride || null);
  const [loading, setLoading] = useState(!campaignOverride);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignOverride && (params.id || params.shareCode)) {
      fetchCampaign();
    }
  }, [params.id, params.shareCode, campaignOverride]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      let query = supabase.from('profiles').select('*');
      
      if (params.shareCode) {
        query = query.eq('share_code', params.shareCode);
      } else if (params.id) {
        query = query.eq('id', params.id);
      }

      const { data: profile, error } = await query.single();

      if (error) {
        throw error;
      }

      if (profile) {
        const campaignData: Campaign = {
          id: profile.id,
          studentName: `${profile.first_name} ${profile.last_name}`,
          goal: profile.funding_goal || 0,
          raised: profile.funding_raised || 0,
          photo: profile.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b407?auto=format&fit=crop&w=150&h=150&q=80',
          shareCode: profile.share_code || '',
          videoUrl: profile.youtube_video_url,
          story: profile.story,
          bannerUrl: profile.banner_url,
          educationPath: profile.education_path,
          fundingNeeds: profile.funding_needs || [],
          goals: profile.goals || [],
          campaignPublished: profile.campaign_published,
          aspirationalTitle: profile.education_path?.program ? `Future ${profile.education_path.program} Professional` : 'Student',
          shortDescription: profile.story ? profile.story.substring(0, 100) + '...' : 'Supporting my educational journey',
          title: `Help ${profile.first_name} ${profile.last_name} achieve their dreams!`
        };

        setCampaign(campaignData);
      }
    } catch (error) {
      console.error('Error fetching campaign:', error);
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  // Simulate support list (hardcoded for now)
  const supporters = [
    { name: "Amanda Springer", amount: 50, label: "New Supporter" },
    { name: "David Kittinger", amount: 200, label: "Top Supporter" },
    { name: "Keshon Mayo", amount: 100 },
  ];

  const handleDonateClick = () => {
    toast({
      title: "Donation feature coming soon!",
      description: "Stay tuned. You'll soon be able to support students directly.",
      variant: "default",
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading campaign...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The campaign you are looking for does not exist.'}</p>
          <Link to="/campaigns" className="text-blue-600 underline">
            Go back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-6 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-10 mb-12">
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <ProfileCard campaign={{
              ...campaign,
              bannerUrl: campaign.bannerUrl
            }} />
            <WhyINeedSupport story={campaign.story} />
            <EducationPath educationPath={campaign.educationPath} />
            <FundingNeeds 
              campaignGoal={campaign.goal}
              fundingBreakdown={campaign.fundingNeeds}
            />
            <ProgressTracker goal={campaign.goal} raised={campaign.raised} />
            <ImpactTracker />
            <WordsOfSupport />
            <DonationOptions studentName={campaign.studentName} onDonate={handleDonateClick} />
          </div>
          <div className="col-span-1 lg:col-span-2 hidden lg:block">
            <StickyDonationCard
              goal={campaign.goal}
              raised={campaign.raised}
              supporters={supporters}
              studentName={campaign.studentName}
              shareCode={campaign.shareCode}
            />
          </div>
        </div>
        <div className="w-full max-w-xl mx-auto lg:hidden">
          <StickyDonationCard
            goal={campaign.goal}
            raised={campaign.raised}
            supporters={supporters}
            studentName={campaign.studentName}
            shareCode={campaign.shareCode}
          />
        </div>
        <CampaignFooter />
      </main>
    </div>
  );
};

export default CampaignDetail;