
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

  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Generate a dynamic color based on campaign ID for unique styling
  const getCardColor = (id: string) => {
    const colors = [
      '#b0b6a9', '#afa294', '#b47460', '#60a6ce', 
      '#46666f', '#8e898f', '#8d516e', '#6e695e'
    ];
    const index = parseInt(id) % colors.length;
    return colors[index];
  };

  const cardColor = getCardColor(campaign.id);

  return (
    <Link
      to={`/campaigns/${campaign.id}`}
      className="group block transition-all duration-200 hover:-translate-y-2 hover:shadow-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
      aria-label={`Support ${campaign.studentName}'s education campaign`}
      onClick={handleClick}
      style={{
        '--card-color': cardColor,
        '--card-shadow': `${cardColor}80`,
        transform: `rotate(${Math.random() * 1.6 - 0.8}deg)`,
      } as React.CSSProperties}
    >
      <div 
        className="bg-white rounded-2xl shadow-lg border-4 overflow-hidden animate-fade-in h-full flex flex-col transition-all duration-200 group-hover:rotate-0 group-hover:shadow-xl"
        style={{
          borderColor: cardColor,
          backgroundColor: cardColor,
          backgroundImage: `radial-gradient(${cardColor}40 1px, transparent 0px)`,
          backgroundSize: '8px 8px',
          boxShadow: `4px 4px 0 ${cardColor}80, 6px 6px 12px rgba(0,0,0,0.15)`,
        }}
      >
        <div className="relative">
          <img 
            src={campaign.photo} 
            alt={campaign.studentName} 
            className="h-56 w-full object-cover rounded-lg m-1"
            style={{ borderRadius: 'calc(1rem - 4px)' }}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-800">
            {percent}% funded
          </div>
        </div>
        
        <div className="flex-1 flex flex-col p-4 bg-white m-1 rounded-lg" style={{ borderRadius: 'calc(1rem - 4px)' }}>
          <h4 className="font-bold text-xl text-gray-800 mb-1 leading-tight line-clamp-1">
            {campaign.studentName}
          </h4>
          <div className="text-blue-600 text-sm font-semibold mb-3 line-clamp-1">
            {campaign.aspirationalTitle}
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {campaign.shortDescription}
          </p>
          
          <div className="mt-auto space-y-3">
            <div className="flex gap-2 items-center text-sm">
              <DollarSign className="text-green-500" size={18} />
              <span className="font-bold text-gray-800">${campaign.raised.toLocaleString()}</span>
              <span className="text-gray-500">/ ${campaign.goal.toLocaleString()}</span>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-600 font-medium text-sm flex items-center gap-1">
                {percent === 100 ? (
                  <>
                    <ArrowUp size={14} /> Funded!
                  </>
                ) : (
                  <>
                    <ArrowUp size={14} /> {percent}% funded
                  </>
                )}
              </span>
              <span className="text-blue-600 font-semibold hover:underline hover:text-blue-800 text-sm">
                Support →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
