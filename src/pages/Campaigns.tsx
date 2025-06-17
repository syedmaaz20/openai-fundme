
import TopNav from "@/components/TopNav";
import CampaignList from "@/components/CampaignList";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
        <section className="w-full max-w-6xl mx-auto mb-10 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Active Campaigns</h1>
          <p className="text-gray-700 text-lg mb-8">
            Find students to support! Click a campaign to read their story and donate.
          </p>
          
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search campaigns by student name, program, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-400 rounded-xl"
            />
          </div>
          
          <CampaignList showAll={true} />
        </section>
      </main>
    </div>
  );
};

export default Campaigns;
