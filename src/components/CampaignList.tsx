import React, { useState, useEffect } from "react";
import { CampaignCard } from "./CampaignCard";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import type { Campaign } from "@/types/campaign";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'student')
        .eq('campaign_published', true);

      if (error) {
        throw error;
      }

      const campaignData: Campaign[] = profiles.map(profile => ({
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
      }));

      setCampaigns(campaignData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading campaigns...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchCampaigns}
          className="text-blue-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No active campaigns found.</p>
        <p className="text-sm text-gray-500">Check back later for new student campaigns!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};

export default CampaignList;
export { CampaignCard };