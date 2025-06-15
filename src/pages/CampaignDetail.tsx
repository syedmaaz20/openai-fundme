import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { campaigns } from "@/components/CampaignList";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trophy, MessageSquare, TrendingUp, ArrowUp } from "lucide-react";

// Fake breakdown + impact data for demo
const fundingBreakdown = [
  { label: "Tuition", amount: 10000, percent: 66.7, color: "bg-blue-400" },
  { label: "Books & Supplies", amount: 2000, percent: 13.3, color: "bg-sky-300" },
  { label: "Living Expenses", amount: 3000, percent: 20.0, color: "bg-green-300" },
];

const impactData = [
  {
    icon: <Trophy className="text-blue-500 mr-2" size={20} />,
    title: "Milestone Achieved",
    description: "Raised $5,000"
  },
  {
    icon: <TrendingUp className="text-sky-500 mr-2" size={20} />,
    title: "Grade Improvement",
    description: "GPA increased to 3.8"
  },
  {
    icon: <MessageSquare className="text-gray-500 mr-2" size={20} />,
    title: "Message from Donor",
    description: <>“<span className="italic">Keep up the great work, Sophia! We believe in you.</span>”</>
  }
];

const educationPath = [
  { label: "Program", value: "Social Work" },
  { label: "Institution", value: "University of California, Los Angeles" },
  { label: "Graduation Date", value: "June 2025" }
];

const donationChoices = [35, 50, 100];

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
        <div className="w-full max-w-xl mx-auto flex flex-col gap-6 mb-12">
          {/* Profile Card */}
          <div className="bg-white p-0 pb-4 rounded-2xl shadow border border-slate-100 overflow-hidden">
            {/* Banner */}
            <div className="h-32 w-full bg-cover bg-center" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80)'
              }}>
              {/* Overlay effect */}
              <div className="h-full w-full bg-gradient-to-b from-white/20 via-transparent to-white/80"></div>
            </div>
            {/* Student profile */}
            <div className="-mt-10 px-4 flex items-end gap-4">
              <img
                src={campaign.photo}
                alt={campaign.studentName}
                className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <div className="flex flex-col justify-end">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xl text-gray-900">{campaign.studentName}</span>
                  <span title="Verified student">
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3193ff"/><path d="M16 9l-4.2 6L8 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
                <div>
                  <button
                    className="text-blue-600 hover:underline text-sm mt-1 flex items-center gap-1"
                    onClick={() => toast({ title: "Share", description: "Sharing feature coming soon!" })}
                  >
                    <ArrowUp className="rotate-45" size={15} /> Share
                  </button>
                </div>
              </div>
            </div>
            {/* Video/Story image */}
            <div className="mt-4 px-4">
              <div className="rounded-lg bg-gray-100 h-44 flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* Placeholder for video */}
                <img
                  src={campaign.photo}
                  alt="Student video"
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white bg-opacity-60 rounded-full p-4 shadow-md">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#697386"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Why I Need Support */}
          <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Why I Need Support</h2>
            <p className="text-gray-700 mb-2">
              I'm a first-generation college student from a low-income background. My dream is to become a social worker and help others in my community. However, the financial burden of tuition and living expenses is making it difficult to continue my studies. Any support you can offer would mean the world to me and bring me closer to achieving my goals.
            </p>
          </section>

          {/* Education Path */}
          <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Education Path</h2>
            <div className="divide-y">
              {educationPath.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-gray-700 text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Funding Needs */}
          <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Funding Needs</h2>
            <div>
              <div className="flex flex-col items-center mb-3">
                {/* Simulated Pie Chart visual */}
                <div className="relative w-36 h-36 flex items-center justify-center mb-2">
                  {/* Pie chart segments - just color blocks for now */}
                  <svg width={140} height={140} viewBox="0 0 40 40">
                    <circle r="16" cx="20" cy="20" fill="#cee3fc" />
                    <path d="M20 4
                      A 16 16 0 0 1 38.286 23.196
                      L 20 20 Z"
                      fill="#60a5fa"/>
                    <path d="M20 4
                      A 16 16 0 1 1 9.6 35.221
                      L 20 20 Z"
                      fill="#7dd3fc"/>
                    <path d="M20 20
                      L 38.286 23.196
                      A 16 16 0 0 1 9.6 35.221
                      Z"
                      fill="#6ee7b7"/>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-gray-700 text-md">
                    Total: ${campaign.goal.toLocaleString()}
                  </span>
                </div>
                <ul className="w-full max-w-xs text-sm mt-2">
                  {fundingBreakdown.map((b, idx) => (
                    <li className="flex justify-between py-1 items-center" key={b.label}>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-3 h-3 rounded-full ${b.color}`} />
                        <span>{b.label}</span>
                      </div>
                      <div>
                        ${b.amount.toLocaleString()} <span className="text-gray-400">({b.percent}%)</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Progress Tracker */}
          <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Progress Tracker</h2>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Raised: <b className="text-gray-700">${campaign.raised.toLocaleString()}</b></span>
              <span>Goal: <b className="text-gray-700">${campaign.goal.toLocaleString()}</b></span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="text-sm font-medium text-blue-700">{percent}% funded</div>
          </section>

          {/* Impact Tracker */}
          <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Impact Tracker</h2>
            <ul className="space-y-3">
              {impactData.map((item, i) => (
                <li key={i} className="flex items-center text-gray-700 text-sm">
                  {item.icon}
                  <span className="font-medium mr-1">{item.title}:</span>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Donation options */}
          <section className="bg-white rounded-xl shadow border border-slate-100 p-6 mb-2">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Support {campaign.studentName}</h2>
            <div className="flex gap-3 mb-3">
              {donationChoices.map(choice => (
                <Button key={choice} size="sm" className="bg-blue-50 text-blue-700 border border-blue-400 hover:bg-blue-100 font-semibold px-5 rounded-md">{`$${choice}`}</Button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom Amount"
              className="w-full border border-gray-200 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              min={1}
            />
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="recurring" className="accent-blue-500" />
              <label htmlFor="recurring" className="text-sm text-gray-600">Make it a recurring donation</label>
              <Button
                variant="link"
                size="sm"
                className="ml-auto px-0 text-blue-500 hover:underline text-xs"
                onClick={() => toast({ title: "Matching Gift", description: "Matching gift feature coming soon!" })}
              >
                Match Gift?
              </Button>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 mt-2 rounded-xl text-base" onClick={handleDonateClick}>
              Donate Now
            </Button>
          </section>
        </div>
        <footer className="bg-gray-100 rounded-xl p-8 mt-8 w-full max-w-xl mx-auto text-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
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
