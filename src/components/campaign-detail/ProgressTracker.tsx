
import React from "react";
import { getPercent } from "@/utils/campaignHelpers";

export default function ProgressTracker({ goal, raised }: { goal: number, raised: number }) {
  const percent = getPercent(raised, goal);
  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">Progress Tracker</h2>
      <div className="flex items-center justify-between text-sm mb-2">
        <span>Raised: <b className="text-gray-700">${raised.toLocaleString()}</b></span>
        <span>Goal: <b className="text-gray-700">${goal.toLocaleString()}</b></span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-sm font-medium text-blue-700">{percent}% funded</div>
    </section>
  );
}
