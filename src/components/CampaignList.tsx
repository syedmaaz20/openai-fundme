
import { CampaignCard } from "./CampaignCard";
import { useCampaigns } from "@/hooks/useCampaigns";

const CampaignList = () => {
  const { data: campaigns, isLoading, error } = useCampaigns();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow border border-gray-100 animate-pulse">
            <div className="h-40 w-full bg-gray-200"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading campaigns</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No campaigns found</p>
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
