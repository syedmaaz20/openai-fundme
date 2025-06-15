import React from "react";
import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { campaigns } from "@/components/CampaignList";
import StickyDonationCard from "@/components/StickyDonationCard";
import { ArrowUp, Trophy, MessageSquare, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

// Fake breakdown + impact data for demo
const fundingBreakdown = [
  {
    label: "Tuition",
    amount: 10000,
    percent: 66.7,
    color: "#60a5fa", // blue-400
    legend: "bg-blue-400",
  },
  {
    label: "Books & Supplies",
    amount: 2000,
    percent: 13.3,
    color: "#7dd3fc", // sky-300
    legend: "bg-sky-300",
  },
  {
    label: "Living Expenses",
    amount: 3000,
    percent: 20.0,
    color: "#6ee7b7", // green-300
    legend: "bg-green-300",
  },
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

// Custom legend dots
const LegendDot = ({ color }: { color: string }) => (
  <span
    className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
    style={{ backgroundColor: color }}
  />
);

const FundingPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload;
    return (
      <div className="rounded-md border bg-white px-3 py-2 shadow text-xs font-semibold text-blue-700">
        {item.label}: ${item.amount.toLocaleString()} ({item.percent}%)
      </div>
    );
  }
  return null;
};

const FundingNeedsSection = ({ campaignGoal }: { campaignGoal: number }) => (
  <section className="bg-white rounded-2xl shadow border border-slate-100 p-6 mb-4">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">Funding Needs</h2>
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
      {/* Pie Chart */}
      <div className="w-48 h-48 flex flex-col items-center justify-center relative">
        {/* Total goal */}
        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-[1.10rem] font-bold text-blue-700">
          ${campaignGoal.toLocaleString()}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={fundingBreakdown}
              dataKey="amount"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={2}
              isAnimationActive
              stroke="white"
            >
              {fundingBreakdown.map((entry, idx) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<FundingPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <ul className="flex-1 flex flex-col gap-4 mt-2 sm:mt-0">
        {fundingBreakdown.map((b, idx) => (
          <li key={b.label} className="flex items-center justify-between">
            <div className="flex items-center">
              <LegendDot color={b.color} />
              <span className="text-gray-800 font-medium">{b.label}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-900 font-bold">${b.amount.toLocaleString()}</span>
              <span className="text-gray-400 ml-2">({b.percent}%)</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const CustomPieLabel = ({ cx, cy, width, height, campaignGoal }: any) => (
  <text
    x={cx}
    y={cy}
    textAnchor="middle"
    dominantBaseline="middle"
    className="font-bold text-gray-700"
    fontSize={20}
  >
    {`Total: $${campaignGoal.toLocaleString()}`}
  </text>
);

const CampaignDetail = () => {
  const { id } = useParams();
  const campaign = campaigns.find((c) => c.id === id);

  // Simulate support list (hardcoded for now)
  const supporters = [
    { name: "Amanda Springer", amount: 50, label: "New Supporter" },
    { name: "David Kittinger", amount: 200, label: "Top Supporter" },
    { name: "Keshon Mayo", amount: 100 },
  ];

  // Simulated words of support (static, can enhance later)
  const wordsOfSupport = [
    {
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Beth Bernstein",
      amount: 250,
      time: "3 d",
      message: `Michelle, Lili, and Lucas, There are no words that can express what I want to say. Please know that I am holding you in my heart, now and always. Michelle, you are always the first one to help others -- now it's your turn to let others help you. (And I know how hard that is for you.) May Andy's memory and legacy be a blessing. Love, Beth`,
    }
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

  const percent = Math.min(
    Math.round((campaign.raised / campaign.goal) * 100),
    100
  );

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
      <main className="flex-1 w-full flex flex-col items-center pt-6 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-10 mb-12">
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            {/* Profile Card, story, education, funding, progress, etc */}
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
            <FundingNeedsSection campaignGoal={campaign.goal} />

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

            {/* Words of Support */}
            <section className="bg-white rounded-xl shadow border border-slate-100 p-6 mt-2">
              <h2 className="text-lg font-semibold mb-1 text-gray-900 flex items-center gap-2">
                Words of support
                <span className="text-blue-700 font-normal text-base">({wordsOfSupport.length})</span>
              </h2>
              <div className="text-gray-500 text-sm mb-3">
                Please donate to share words of support.
              </div>
              <ul className="divide-y">
                {wordsOfSupport.map((ws, idx) => (
                  <li key={idx} className="py-4 flex items-start gap-3">
                    <Avatar className="w-10 h-10 mt-1">
                      <AvatarImage src={ws.avatarUrl} alt={ws.name} />
                      <AvatarFallback>{ws.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center leading-tight mb-1">
                        <span className="font-semibold text-gray-900">{ws.name}</span>
                        <span className="text-gray-500 text-sm">${ws.amount} &middot; {ws.time}</span>
                      </div>
                      <div className="text-gray-800 text-[15px] leading-snug whitespace-pre-line break-words">
                        {ws.message}
                      </div>
                    </div>
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
            {/* Example, you'd expand here with ... */}
            {/* ... */}
          </div>

          {/* Sticky Donation Card */}
          <div className="col-span-1 lg:col-span-2 hidden lg:block">
            <StickyDonationCard
              goal={campaign.goal}
              raised={campaign.raised}
              supporters={supporters}
              studentName={campaign.studentName}
            />
          </div>
        </div>

        {/* Show donation card inline on mobile */}
        <div className="w-full max-w-xl mx-auto lg:hidden">
          <StickyDonationCard
            goal={campaign.goal}
            raised={campaign.raised}
            supporters={supporters}
            studentName={campaign.studentName}
          />
        </div>

        <footer className="bg-gray-100/90 rounded-2xl shadow-sm p-10 mt-12 w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-around items-center gap-6">
          <div className="flex flex-col sm:flex-row gap-10 w-full justify-center text-center">
            <div>
              <span className="font-bold text-lg text-slate-900 block mb-1">Easy</span>
              <span className="text-gray-500 text-sm">Donate quickly and easily</span>
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 block mb-1">Powerful</span>
              <span className="text-gray-500 text-sm">Support students directly</span>
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 block mb-1">Trusted</span>
              <span className="text-gray-500 text-sm">Your donation is protected</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default CampaignDetail;
