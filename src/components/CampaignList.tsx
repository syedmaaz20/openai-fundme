
import { CampaignCard, Campaign } from "./CampaignCard";

// Updated campaign data structure to include aspirationalTitle and shortDescription
const campaigns: Campaign[] = [
  {
    id: "1",
    studentName: "Amina Yusuf",
    aspirationalTitle: "Aspiring Doctor",
    shortDescription: "A top student from rural Kenya, passionate about serving her community through medicine.",
    title: "Scholarship for Medical School",
    story: "Amina is a top student from a rural community in Kenya. Help her continue her medical studies and serve her village.",
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    goal: 5000,
    raised: 2750,
  },
  {
    id: "2",
    studentName: "Pedro González",
    aspirationalTitle: "Future Engineer",
    shortDescription: "Pedro dreams of building sustainable solutions for his hometown while pursuing engineering.",
    title: "Engineering Dreams",
    story: "Pedro's family cannot afford university fees. Your donation fuels his dream to become an engineer and build solutions for his town.",
    photo: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    goal: 3000,
    raised: 1200,
  },
  {
    id: "3",
    studentName: "Chloe Zhao",
    aspirationalTitle: "Young Scientist",
    shortDescription: "Chloe’s love for science drives her to innovate despite limited access to lab resources.",
    title: "STEM Supplies for Chloe",
    story: "Chloe is passionate about science but lacks resources for basic lab equipment. Your support ignites a young scientist's career.",
    photo: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80",
    goal: 800,
    raised: 800,
  },
  {
    id: "4",
    studentName: "Samson Eke",
    aspirationalTitle: "College Hopeful",
    shortDescription: "Samson aims to lift his family from poverty by becoming the first to attend college.",
    title: "From the Village to College",
    story: "Samson dreams of attending college to lift his family out of poverty. Each donation takes him a step closer to that dream.",
    photo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
    goal: 2500,
    raised: 750,
  },
];

const CampaignList = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
    {campaigns.map((campaign) => (
      <CampaignCard key={campaign.id} campaign={campaign} />
    ))}
  </div>
);

export default CampaignList;
export { campaigns }; // export campaigns for use in detail page

