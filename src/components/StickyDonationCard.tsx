
import { Button } from "@/components/ui/button";
import { TrendingUp, Share2, Users } from "lucide-react";
import React from "react";

type Donor = {
  name: string;
  amount: number;
  label?: string;
  avatarUrl?: string;
};

type Props = {
  goal: number;
  raised: number;
  supporters: Donor[];
  studentName: string;
};

export default function StickyDonationCard({
  goal,
  raised,
  supporters,
  studentName,
}: Props) {
  const percent = Math.min(Math.round((raised / goal) * 100), 100);

  return (
    <aside className="w-full sm:max-w-sm bg-white rounded-2xl shadow-lg border border-slate-100 p-5 relative
      sm:sticky sm:top-6 z-10 mx-auto">
      <div className="flex flex-col gap-2">
        <div className="w-16 h-16 mx-auto my-2 relative flex items-center justify-center">
          {/* Circle progress */}
          <svg width={64} height={64} className="absolute">
            <circle
              cx="32"
              cy="32"
              r="29"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="29"
              stroke="#fbbf24"
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * 29}
              strokeDashoffset={
                2 * Math.PI * 29 * (1 - percent / 100)
              }
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s" }}
            />
          </svg>
          <span className="relative text-xl font-bold text-gray-800">{percent}%</span>
        </div>
        <div className="text-center mb-2">
          <span className="text-lg font-semibold text-gray-900">
            ${raised.toLocaleString()}
          </span>
          <span className="text-gray-500"> raised of ${goal.toLocaleString()}</span>
        </div>
        <div className="flex gap-2 justify-center mb-4">
          <Button variant="outline" className="border-yellow-400 text-yellow-700 px-3 flex gap-1 items-center">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button
            className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full shadow 
            hover:from-yellow-500 hover:to-yellow-400 transition-all"
          >
            Donate
          </Button>
        </div>
        <div className="mb-3 flex items-center gap-1 text-xs justify-center text-gray-500">
          <Users size={16} /> <span>{supporters.length} recent supporters</span>
        </div>
        <div className="rounded-xl bg-yellow-50/70 border border-yellow-100 px-3 py-2 mb-2">
          <div className="text-xs text-yellow-800 font-medium">
            Show your support for <span className="font-semibold">{studentName}</span>'s journey. Every contribution helps!
          </div>
        </div>
        {/* Recent donations */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-yellow-600" />
            <span className="text-xs text-gray-800 font-semibold">Recent Activity</span>
          </div>
          <ul className="space-y-2 mt-1 max-h-36 overflow-y-auto">
            {supporters.slice(0, 4).map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold border border-yellow-300">
                  {d.avatarUrl ? (
                    <img
                      src={d.avatarUrl}
                      alt={d.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    d.name[0]
                  )}
                </div>
                <span className="font-semibold text-gray-700">{d.name}</span>
                <span className="text-yellow-600 font-bold ml-auto">${d.amount}</span>
                {d.label && (
                  <span className="ml-1 text-yellow-600 bg-yellow-100 px-2 rounded-full text-[11px] font-medium">{d.label}</span>
                )}
              </li>
            ))}
          </ul>
          {supporters.length > 4 && (
            <Button variant="link" size="sm" className="text-yellow-700 px-0 mt-1 text-xs float-right">
              See all
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
