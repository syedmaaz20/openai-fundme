
import { useCampaignByShareCode } from "@/hooks/useCampaigns";

/**
 * Get the share URL for a campaign
 */
export function getCampaignShareUrl(shareCode: string) {
  if (!shareCode) return window.location.origin;
  return `${window.location.origin}/c/${shareCode}`;
}

/**
 * Hook to find campaign by shareCode
 */
export function useFindCampaignByShareCode(shareCode: string) {
  return useCampaignByShareCode(shareCode);
}
