
import { campaigns } from "@/components/CampaignList";
import type { Campaign } from "@/types/campaign";

/**
 * Find campaign by shortCode (shareCode)
 */
export function findCampaignByShareCode(shareCode: string): Campaign | undefined {
  return campaigns.find(cmp => cmp.shareCode === shareCode);
}

/**
 * Get the share URL for a campaign
 */
export function getCampaignShareUrl(shareCode: string) {
  if (!shareCode) return window.location.origin;
  return `${window.location.origin}/c/${shareCode}`;
}
