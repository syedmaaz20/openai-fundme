
import { ArrowUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export interface Campaign {
  id: string;
  studentName: string;
  // New fields for student focus
  aspirationalTitle: string;
  shortDescription: string;
  title: string;
  story: string;
  photo: string;
  goal: number;
  raised: number;
}

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const percent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  return (
    <Link
      to={`/campaigns/${campaign.id}`}
      className="bg-white rounded-2xl shadow group transition-transform duration-150 hover:scale-105 hover:shadow-lg border border-gray-100 flex flex-col animate-fade-in overflow-hidden cursor-pointer focus:ring-2 focus:ring-blue-400"
      aria-label={`Support ${campaign.studentName}'s education campaign`}
    >
      <img src={campaign.photo} alt={campaign.studentName} className="h-40 w-full object-cover" />
      <div className="flex-1 flex flex-col p-5">
        <h4 className="font-extrabold text-2xl text-gray-800 mb-0.5 leading-tight">{campaign.studentName}</h4>
        <div className="text-blue-600 text-sm font-semibold mb-1">
          {campaign.aspirationalTitle}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.shortDescription}</p>
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

export type { Campaign };

