
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Campaign } from "@/types/campaign";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async (): Promise<Campaign[]> => {
      console.log("Fetching campaigns from Supabase...");
      
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          profile:profiles(
            full_name,
            aspirational_title,
            university,
            bio,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
      }

      console.log("Campaigns fetched successfully:", data);

      // Transform the data to match our Campaign interface
      return data.map((campaign) => ({
        id: campaign.id,
        profile_id: campaign.profile_id,
        title: campaign.title,
        short_description: campaign.short_description,
        story: campaign.story,
        photo_url: campaign.photo_url,
        goal: campaign.goal,
        raised: campaign.raised,
        share_code: campaign.share_code,
        video_url: campaign.video_url,
        created_at: campaign.created_at,
        updated_at: campaign.updated_at,
        profile: campaign.profile,
      }));
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: async (): Promise<Campaign | null> => {
      console.log(`Fetching campaign ${id} from Supabase...`);
      
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          profile:profiles(
            full_name,
            aspirational_title,
            university,
            bio,
            avatar_url
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching campaign:", error);
        throw error;
      }

      if (!data) {
        return null;
      }

      console.log("Campaign fetched successfully:", data);

      return {
        id: data.id,
        profile_id: data.profile_id,
        title: data.title,
        short_description: data.short_description,
        story: data.story,
        photo_url: data.photo_url,
        goal: data.goal,
        raised: data.raised,
        share_code: data.share_code,
        video_url: data.video_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        profile: data.profile,
      };
    },
    enabled: !!id,
  });
}

export function useCampaignByShareCode(shareCode: string) {
  return useQuery({
    queryKey: ["campaign-by-share-code", shareCode],
    queryFn: async (): Promise<Campaign | null> => {
      console.log(`Fetching campaign by share code ${shareCode} from Supabase...`);
      
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          *,
          profile:profiles(
            full_name,
            aspirational_title,
            university,
            bio,
            avatar_url
          )
        `)
        .eq("share_code", shareCode)
        .maybeSingle();

      if (error) {
        console.error("Error fetching campaign by share code:", error);
        throw error;
      }

      if (!data) {
        return null;
      }

      console.log("Campaign fetched by share code successfully:", data);

      return {
        id: data.id,
        profile_id: data.profile_id,
        title: data.title,
        short_description: data.short_description,
        story: data.story,
        photo_url: data.photo_url,
        goal: data.goal,
        raised: data.raised,
        share_code: data.share_code,
        video_url: data.video_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        profile: data.profile,
      };
    },
    enabled: !!shareCode,
  });
}
