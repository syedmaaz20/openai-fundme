
import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { campaigns } from "@/components/CampaignList";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const CampaignDetail = () => {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === id);

  // Simulate support list (hardcoded for now)
  const supporters = [
    { name: "Amanda Springer", amount: 50, note: "Great job!" },
    { name: "David Kittinger", amount: 200, note: "Proud of you!" },
    { name: "Keshon Mayo", amount: 100, note: "" },
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

  const percent = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);

  // Show a toast when donating
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
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left/Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {campaign.title}
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <img
                src={campaign.photo}
                alt={campaign.studentName}
                className="w-9 h-9 rounded-full border object-cover"
              />
              <span className="font-semibold text-md text-gray-700">
                {campaign.studentName}
              </span>
              <span className="text-xs text-gray-500">Organizer</span>
            </div>
            {/* Campaign Images */}
            <img
              src={campaign.photo}
              alt={campaign.title}
              className="w-full h-64 object-cover rounded-lg shadow mb-5 border"
            />
            {/* Story */}
            <h2 className="text-lg font-bold mb-1 text-gray-700">Story</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{campaign.story}</p>

            <div className="flex flex-col md:flex-row gap-2 mb-6">
              <Button className="w-full md:w-44 text-base font-semibold bg-gradient-to-r from-green-500 to-blue-500 shadow-md hover:scale-105 transition"
                onClick={handleDonateClick}
              >
                Donate now
              </Button>
              <Button
                variant="outline"
                className="w-full md:w-32 text-base"
                onClick={() => toast({ title: "Share", description: "Sharing feature coming soon!" })}
              >
                Share
              </Button>
            </div>

            {/* Organizer section */}
            <section className="mb-6">
              <h3 className="font-bold text-gray-900 mb-1">Organizer</h3>
              <div className="flex items-center gap-3">
                <img src={campaign.photo} alt="profile" className="h-8 w-8 rounded-full border object-cover" />
                <div>
                  <p className="font-medium text-gray-800">{campaign.studentName}</p>
                  <p className="text-xs text-gray-500">Organizer - {campaign.title.split(" ")[0]}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2">Contact</Button>
            </section>

            {/* Words of Support */}
            <section className="mb-12">
              <h3 className="font-bold text-gray-900 mb-2">Words of support</h3>
              <p className="text-gray-500 text-sm mb-3">
                Please donate to share words of support.
              </p>
              <ul className="space-y-3">
                {supporters.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-600">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{s.name}</span>
                      <span className="ml-2 text-xs text-green-700 font-semibold">
                        ${s.amount}
                      </span>
                      {s.note && (
                        <p className="text-xs text-gray-600">{s.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          {/* Right/Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white border shadow-lg rounded-xl p-6 mb-6 sticky top-24">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold">${campaign.raised.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">raised</span>
              </div>
              <div className="text-gray-600 text-xs mb-2">
                <span className="font-semibold">${campaign.goal.toLocaleString()}</span> goal
              </div>
              {/* Progress bar */}
              <div className="h-3 bg-gray-200 rounded-full mb-4">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <Button
                className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold text-lg hover:scale-105 transition"
                onClick={handleDonateClick}
              >
                Donate now
              </Button>
              <div className="mt-5 border-t pt-3">
                <span className="text-sm font-medium text-gray-800 block mb-2">Recent supporters</span>
                <ul className="space-y-1 mb-4">
                  {supporters.slice(0, 2).map((s, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex justify-between">
                      <span className="truncate">{s.name}</span>
                      <span className="text-green-700 font-semibold">${s.amount}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" size="sm" className="w-full py-1 text-xs">
                  See all
                </Button>
              </div>
            </div>
          </aside>
        </div>
        {/* Additional Info / Footer */}
        <footer className="bg-gray-100 rounded-xl p-8 mt-8 w-full max-w-5xl mx-auto text-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="font-bold">Easy</span>
              <span className="block text-xs text-gray-500">Donate quickly and easily</span>
            </div>
            <div>
              <span className="font-bold">Powerful</span>
              <span className="block text-xs text-gray-500">Support students directly</span>
            </div>
            <div>
              <span className="font-bold">Trusted</span>
              <span className="block text-xs text-gray-500">Your donation is protected</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CampaignDetail;
