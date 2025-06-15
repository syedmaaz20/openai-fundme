
import React from "react";
import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { campaigns } from "@/components/CampaignList";
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

const CampaignDetail = ({ campaign: campaignOverride }: { campaign?: any } = {}) => {
  // If campaign is passed in as a prop (resolved by shortCode), use it, else fall back to normal param-based lookup.
  const params = useParams();
  const campaign = campaignOverride || campaigns.find(c => c.id === (params.id || params.campaignId));

  // Simulate support list (hardcoded for now)
  const supporters = [
    { name: "Amanda Springer", amount: 50, label: "New Supporter" },
    { name: "David Kittinger", amount: 200, label: "Top Supporter" },
    { name: "Keshon Mayo", amount: 100 },
  ];

  if (!campaign) {
    return (
      <div>
        <TopNav />
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <Link to="/campaigns" className="text-blue-600 underline">
            Go back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  const handleDonateClick = () => {
    toast({
      title: "Donation feature coming soon!",
      description: "Stay tuned. You'll soon be able to support students directly.",
      variant: "default",
    });
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-6 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-10 mb-12">
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <ProfileCard campaign={campaign} />
            <WhyINeedSupport />
            <EducationPath />
            <FundingNeeds campaignGoal={campaign.goal} />
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
