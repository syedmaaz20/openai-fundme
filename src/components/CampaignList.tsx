
import { CampaignCard } from "./CampaignCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// dummy campaign data with short shareCode and videoUrl
export const campaigns = [
  {
    id: "1",
    studentName: "Sophia Williams",
    aspirationalTitle: "Future Social Worker, Transforming Lives",
    shortDescription: "I'm fundraising for my final year at UCLA. Your support will help pay my tuition and living expenses.",
    title: "Help Sophia Graduate from UCLA!",
    story: "I am a first-generation college student studying Social Work at UCLA. I aspire to help families and children in underserved communities. But due to rising tuition fees and living costs, I need help to continue pursuing my dream.",
    photo: "https://randomuser.me/api/portraits/women/75.jpg",
    goal: 15000,
    raised: 7220,
    shareCode: "sophie1",
    videoUrl: "https://www.youtube.com/watch?v=bA_4thDLkoA" // Demo video
  },
  {
    id: "2",
    studentName: "Juan Rodriguez",
    aspirationalTitle: "First-Generation Engineer",
    shortDescription: "Raising funds for books, supplies, and lab fees as I complete my Mechanical Engineering degree.",
    title: "Support Juan's Engineering Journey",
    story:
      "Coming from a low-income family, I've always dreamed of becoming an engineer. Your contribution will help me pay for critical expenses and stay in school.",
    photo: "https://randomuser.me/api/portraits/men/85.jpg",
    goal: 18000,
    raised: 4880,
    shareCode: "juan2",
    videoUrl: "https://www.youtube.com/watch?v=bA_4thDLkoA" // Demo video
  }
];

// CampaignList component with scroll and view more
const CampaignList = ({ showAll = false }: { showAll?: boolean }) => {
  const maxHeight = showAll ? 'auto' : '500px';
  
  return (
    <div className="space-y-6">
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-hidden"
        style={{ maxHeight: showAll ? 'auto' : maxHeight }}
      >
        {campaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
      
      {!showAll && (
        <div className="flex justify-center mt-8">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-green-400 hover:scale-105 transition-transform">
            <Link to="/campaigns" className="flex items-center gap-2">
              View All Campaigns
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
export { CampaignCard };
