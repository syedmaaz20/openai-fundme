import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/types/campaign";

/**
 * Find campaign by shortCode (shareCode)
 */
export async function findCampaignByShareCode(shareCode: string): Promise<Campaign | undefined> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('share_code', shareCode)
      .eq('campaign_published', true)
      .single();

    if (error || !profile) {
      return undefined;
    }

    return {
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
  } catch (error) {
    console.error('Error finding campaign by share code:', error);
    return undefined;
  }
}

/**
 * Get the share URL for a campaign
 */
export function getCampaignShareUrl(shareCode: string) {
  if (!shareCode) return window.location.origin;
  return `${window.location.origin}/c/${shareCode}`;
}