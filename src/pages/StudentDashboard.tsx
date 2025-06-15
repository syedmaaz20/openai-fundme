
import React from "react";
import { User, BookOpen, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const mockStudent = {
  name: "Jane Doe",
  university: "Springfield University",
  major: "Computer Science",
  verified: true,
  photo: "https://randomuser.me/api/portraits/women/68.jpg",
  stats: {
    totalRaised: 4200,
    campaigns: 2,
    supporters: 34,
    verified: true,
  },
  campaigns: [
    {
      id: "1",
      title: "Semester Tuition Fall 2025",
      goal: 5000,
      raised: 4200,
      status: "Active",
    },
    {
      id: "2",
      title: "Books Fund 2025",
      goal: 800,
      raised: 210,
      status: "Draft",
    },
  ],
};

export default function StudentDashboard() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-5 mb-8">
        <img
          src={mockStudent.photo}
          alt={mockStudent.name}
          className="w-24 h-24 rounded-full shadow border-2 border-white"
        />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{mockStudent.name}</h1>
            {mockStudent.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">
                <Check size={16} className="text-blue-500" /> Verified
              </span>
            )}
          </div>
          <div className="text-gray-600">{mockStudent.university}</div>
          <div className="text-gray-500 text-sm">{mockStudent.major}</div>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <User className="text-blue-500" />
            <CardTitle className="text-base font-medium">Supporters</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold">{mockStudent.stats.supporters}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <BookOpen className="text-green-500" />
            <CardTitle className="text-base font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold">{mockStudent.stats.campaigns}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <span className="text-yellow-500">$</span>
            <CardTitle className="text-base font-medium">Total Raised</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold">${mockStudent.stats.totalRaised}</span>
          </CardContent>
        </Card>
      </div>
      {/* Campaigns List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Campaigns</h2>
        <div className="space-y-4">
          {mockStudent.campaigns.map((c) => (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{c.title}</CardTitle>
                  <div className="text-sm text-gray-500">
                    Goal: ${c.goal} &nbsp;|&nbsp; Raised: ${c.raised}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                    c.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
