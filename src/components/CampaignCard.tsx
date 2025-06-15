
import { ArrowUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import type { Campaign } from "@/types/campaign";

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const percent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Get student name and other info from the profile
  const studentName = campaign.profile?.full_name || "Unknown Student";
  const aspirationalTitle = campaign.profile?.aspirational_title || "";
  const shortDescription = campaign.short_description || "";
  const photo = campaign.photo_url || campaign.profile?.avatar_url || "";

  return (
    <Link
      to={`/campaigns/${campaign.id}`}
      className="bg-white rounded-2xl shadow group transition-transform duration-150 hover:scale-105 hover:shadow-lg border border-gray-100 flex flex-col animate-fade-in overflow-hidden cursor-pointer focus:ring-2 focus:ring-blue-400"
      aria-label={`Support ${studentName}'s education campaign`}
      onClick={handleClick}
    >
      <img src={photo} alt={studentName} className="h-40 w-full object-cover" />
      <div className="flex-1 flex flex-col p-5">
        <h4 className="font-extrabold text-2xl text-gray-800 mb-0.5 leading-tight">{studentName}</h4>
        <div className="text-blue-600 text-sm font-semibold mb-1">
          {aspirationalTitle}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shortDescription}</p>
        <div className="mt-auto">
          <div className="flex gap-2 items-center text-xs mb-1">
            <DollarSign className="text-green-500 mr-1" size={18} />
            <span className="font-semibold text-gray-800">${campaign.raised.toLocaleString()}</span>
            <span className="text-gray-500">&nbsp;/ ${campaign.goal.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded mt-1 mb-2 overflow-hidden">
            <div
              className={`h-full rounded bg-gradient-to-r from-blue-500 to-green-400 transition-all`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-green-600 font-medium">
              {percent === 100 ? (
                <>
                  <ArrowUp className="inline-block" size={13} /> Funded!
                </>
              ) : (
                <>
                  <ArrowUp className="inline-block" size={13} /> {percent}% funded
                </>
              )}
            </span>
            <span
              className="text-blue-600 font-medium hover:underline hover:text-blue-800 select-none cursor-pointer"
              tabIndex={-1}
            >
              Support
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
