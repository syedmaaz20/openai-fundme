import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { campaigns } from "@/components/CampaignList";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import StudentProfileCard from "@/components/StudentProfileCard";
import { Share } from "lucide-react";

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

  const handleShare = () =>
    toast({ title: "Share", description: "Sharing feature coming soon!" });

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left/Main Content */}
          <div className="lg:col-span-2">
            {/* Student Profile Section */}
            <StudentProfileCard
              studentName={campaign.studentName}
              photo={campaign.photo}
              program="Social Work"
              institution="University of California, Los Angeles"
              gradDate="June 2025"
              isVerified={true}
              onShare={handleShare}
            />
            {/* Story Section */}
            <section className="mb-7 bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-2 text-gray-800">Why I Need Support</h2>
              <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed">
                {campaign.story}
              </p>
            </section>
            {/* Education Path */}
            <section className="mb-7 bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Education Path</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Program:</span>
                  <br />
                  Social Work
                </div>
                <div>
                  <span className="font-medium">Institution:</span>
                  <br />
                  University of California, Los Angeles
                </div>
                <div>
                  <span className="font-medium">Graduation Date:</span>
                  <br />
                  June 2025
                </div>
              </div>
            </section>
            {/* Progress & Fundraising */}
            <section className="mb-7 bg-white rounded-2xl shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Funding Progress</h3>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  <span className="font-bold text-blue-700">${campaign.raised.toLocaleString()}</span> raised
                </span>
                <span>
                  <span className="font-medium text-gray-500">Goal: ${campaign.goal.toLocaleString()}</span>
                </span>
              </div>
              <div className="h-3 bg-blue-100 rounded-full mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-right text-xs text-blue-800 font-semibold mb-2">{percent}% funded</div>
              <Button className="w-full py-2 mt-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold text-base hover:scale-105 transition"
                onClick={handleDonateClick}
              >
                Donate Now
              </Button>
            </section>
            {/* (Optional) Impact Tracker - Demo illustration */}
            <section className="mb-10 bg-gray-50 rounded-2xl shadow p-6 border border-gray-100">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Impact Tracker</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full text-blue-700">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <span>Milestone achieved: <b>Raised $5,000</b></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full text-blue-700">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 4v16M4 12h16" />
                    </svg>
                  </span>
                  <span>Grade improvement: <b>GPA increased to 3.8</b></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full text-blue-700">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <path d="M8 10h8M8 14h4" />
                    </svg>
                  </span>
                  <span>Message from donor: <span className="italic">
                    "Keep up the great work. We believe in you!"
                    </span>
                  </span>
                </li>
              </ul>
            </section>
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
