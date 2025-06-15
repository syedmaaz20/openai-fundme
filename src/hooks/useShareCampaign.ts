
import { toast } from "@/hooks/use-toast";
import { getCampaignShareUrl } from "@/utils/campaignShortUrl";

/**
 * Hook to trigger browser share/clipboard for a campaign.
 */
export function useShareCampaign() {
  return (opts: { 
    studentName: string;
    shareCode: string;
  }) => {
    const shareUrl = getCampaignShareUrl(opts.shareCode);
    const title = `Support ${opts.studentName}'s educational journey!`;
    const text = `${opts.studentName} needs your support. Read their story and help!`;
    // Prefer Web Share API if available
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url: shareUrl,
      }).then(() => {
        toast({ title: "Shared!", description: "Link shared successfully." });
      }).catch(() => {
        // fallback to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({ title: "Link Copied", description: "Share link copied to clipboard." });
        });
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({ title: "Link Copied", description: "Share link copied to clipboard." });
      }).catch(() => {
        toast({ title: "Unable to Share", description: "Could not copy link." });
      });
    } else {
      // super fallback
      window.prompt("Copy this campaign link:", shareUrl);
    }
  };
}
