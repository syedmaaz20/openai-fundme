
import TopNav from "@/components/TopNav";
import CampaignList from "@/components/CampaignList";

const Campaigns = () => (
  <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
    <TopNav />
    <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
      <section className="w-full max-w-6xl mx-auto mb-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Active Campaigns</h1>
        <p className="text-gray-700 text-lg mb-8">
          Find students to support! Click a campaign to read their story and donate.
        </p>
        <CampaignList />
      </section>
    </main>
  </div>
);
export default Campaigns;
