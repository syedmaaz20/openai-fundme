
import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { campaigns } from "@/components/CampaignList";

const CampaignDetail = () => {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === id);

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

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
        <section className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 mt-8">
          <img
            src={campaign.photo}
            alt={campaign.studentName}
            className="w-full h-56 object-cover rounded-lg mb-6"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{campaign.title}</h2>
          <p className="text-sm font-semibold text-blue-500 mb-2">By {campaign.studentName}</p>
          <p className="text-gray-700 mb-6">{campaign.story}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="font-semibold text-lg text-gray-800">${campaign.raised.toLocaleString()}</span>
            <span className="text-gray-500">/ ${campaign.goal.toLocaleString()}</span>
          </div>

          <button
            className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold shadow hover:scale-105 transition text-lg"
            disabled
            title="Donation functionality coming soon"
          >
            Donate Now
          </button>
          <p className="text-center mt-3 text-sm text-gray-500">(Donation functionality coming soon)</p>
        </section>
      </main>
    </div>
  );
};

export default CampaignDetail;
