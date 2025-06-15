
import { CampaignCard } from "./CampaignCard";

// dummy campaign data with short shareCode
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
    shareCode: "sophie1" // short, unique code
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
    shareCode: "juan2"
  }
];

// CampaignList component renders all campaigns using CampaignCard
const CampaignList = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    {campaigns.map(campaign => (
      <CampaignCard key={campaign.id} campaign={campaign} />
    ))}
  </div>
);

export default CampaignList;
export { CampaignCard };
