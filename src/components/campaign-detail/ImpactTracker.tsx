
import React from "react";
import { Trophy, TrendingUp, MessageSquare } from "lucide-react";

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

export default function ImpactTracker() {
  return (
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
  );
}
