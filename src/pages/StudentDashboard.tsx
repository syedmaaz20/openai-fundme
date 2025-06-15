
import React from "react";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, TrendingUp, Users, DollarSign } from "lucide-react";

const mockStudent = {
  name: "Jane Doe",
  university: "VIT University",
  major: "Medicine",
  photo: "https://randomuser.me/api/portraits/women/68.jpg",
  campaigns: [
    {
      id: "1",
      title: "UNU versity",
      category: "Medicine",
      institution: "VIT University",
      image: "/lovable-uploads/f1c776dc-13c8-41bb-bd89-b850a60ddb30.png",
      goal: 100,
      raised: 0,
      daysLeft: 180,
      status: "Active",
    },
  ],
  stats: {
    totalRaised: 0,
    activeCampaigns: 1,
    donors: 0,
  },
};

export default function StudentDashboard() {
  const c = mockStudent.campaigns[0];
  return (
    <div className="flex bg-[#f7f9fb] min-h-screen">
      <StudentSidebar />
      <main className="flex-1 px-2 sm:px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your fundraising campaigns and track your progress</p>
          </div>
          <Button variant="default" size="lg" className="mt-2 sm:mt-0 flex gap-2 items-center shadow">
            <PlusCircle size={20} /> Create New Campaign
          </Button>
        </div>

        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="flex items-center bg-white shadow rounded-xl px-6 py-5 gap-3 border border-gray-50">
            <span className="bg-blue-100 rounded-lg p-2">
              <DollarSign size={30} className="text-blue-700" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Raised</p>
              <div className="text-xl font-bold">${mockStudent.stats.totalRaised}</div>
            </div>
          </div>
          <div className="flex items-center bg-white shadow rounded-xl px-6 py-5 gap-3 border border-gray-50">
            <span className="bg-green-100 rounded-lg p-2">
              <TrendingUp size={30} className="text-green-700" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Active Campaigns</p>
              <div className="text-xl font-bold">{mockStudent.stats.activeCampaigns}</div>
            </div>
          </div>
          <div className="flex items-center bg-white shadow rounded-xl px-6 py-5 gap-3 border border-gray-50">
            <span className="bg-yellow-100 rounded-lg p-2">
              <Users size={30} className="text-yellow-700" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Donors</p>
              <div className="text-xl font-bold">{mockStudent.stats.donors}</div>
            </div>
          </div>
        </section>

        {/* Campaigns section */}
        <section className="">
          <h2 className="text-lg font-semibold mb-3">Your Campaigns</h2>
          <div className="flex flex-col md:flex-row gap-5 items-stretch">
            <div className="bg-white rounded-xl shadow border p-0 max-w-sm w-full">
              <div className="relative">
                <img src={c.image} alt={c.title} className="rounded-t-xl object-cover h-40 w-full" />
                <span className="absolute top-2 left-2 bg-blue-200 text-blue-900 text-xs px-2 py-0.5 rounded-full font-medium">Medicine</span>
                <span className="absolute top-2 right-2 bg-gray-900/80 text-white text-[11px] px-2 py-0.5 rounded">Manage</span>
              </div>
              <div className="px-5 py-4">
                <h3 className="font-semibold mb-1">{c.title}</h3>
                <div className="text-xs text-muted-foreground mb-1">by You • {c.institution}</div>
                <div className="flex items-center gap-1 text-sm mb-2">
                  <span className="text-base font-bold">${c.raised}</span>
                  <span className="text-muted-foreground text-xs">raised</span>
                  <span className="mx-2">|</span>
                  <span className="text-xs">${c.goal} goal</span>
                </div>
                <div className="flex items-center text-xs gap-6 text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><TrendingUp size={14}/> 0%</span>
                  <span className="flex items-center gap-1"><ArrowRight size={14} /> {c.daysLeft} days left</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <Button variant="secondary" className="w-full">View Campaign</Button>
                  <Button variant="outline" className="w-full">Manage Milestones</Button>
                </div>
              </div>
            </div>
            <div className="hidden md:block flex-1"></div>
          </div>
          <div className="text-sm text-muted-foreground mt-2 ml-2">Click on any campaign to manage milestones and updates</div>
        </section>

        {/* Info and Tips Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-9">
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center gap-2 mb-1 font-semibold">
              <span className="inline-block bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center mr-1 text-xs">!</span>
              Managing Your Campaigns
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-white rounded-lg border p-3 flex-1 mb-1">
                <div className="font-semibold text-sm mb-1">Campaign Management</div>
                <div className="text-xs text-muted-foreground">Click the "Manage" button on any campaign to access detailed management options, view documents, and track progress.</div>
              </div>
              <div className="bg-white rounded-lg border p-3 flex-1 mb-1">
                <div className="font-semibold text-sm mb-1">Add Milestones</div>
                <div className="text-xs text-muted-foreground">For approved campaigns, use the "Manage Milestones" button to add updates and share your progress with donors.</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1 font-semibold text-blue-900">
              ✓ Tips for Successful Campaigns
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-white rounded-lg border p-3 flex-1 mb-1">
                <div className="font-semibold text-sm mb-1">Tell Your Story</div>
                <div className="text-xs text-muted-foreground">Share your personal journey and educational goals to connect with potential donors.</div>
              </div>
              <div className="bg-white rounded-lg border p-3 flex-1 mb-1">
                <div className="font-semibold text-sm mb-1">Post Regular Updates</div>
                <div className="text-xs text-muted-foreground">Keep your donors engaged by sharing progress and achievements regularly through milestones.</div>
              </div>
              <div className="bg-white rounded-lg border p-3 flex-1 mb-1">
                <div className="font-semibold text-sm mb-1">Share Your Campaign</div>
                <div className="text-xs text-muted-foreground">Promote your campaign on social media and personal networks to reach more potential donors.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
