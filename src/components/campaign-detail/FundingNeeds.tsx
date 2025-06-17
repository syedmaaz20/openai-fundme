
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from "recharts";
import { getFundingBreakdown } from "@/utils/campaignHelpers";
import type { FundingBreakdown } from "@/types/campaign";

const fundingBreakdown = getFundingBreakdown();

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

interface FundingNeedsProps {
  campaignGoal: number;
}

const FundingNeeds: React.FC<FundingNeedsProps> = ({ campaignGoal }) => {
  return (
    <section className="bg-white rounded-2xl shadow border border-slate-100 p-6 mb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Funding Needs</h2>
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Pie Chart */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center" style={{ minWidth: "170px" }}>
          <div className="relative flex items-center justify-center w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingBreakdown}
                  dataKey="amount"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={51}
                  outerRadius={70}
                  paddingAngle={1.5}
                  isAnimationActive
                  stroke="white"
                >
                  {fundingBreakdown.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                  <Label
                    value={`$${campaignGoal.toLocaleString()}`}
                    position="center"
                    style={{
                      fontSize: "1.3rem",
                      fill: "#2563eb",
                      fontWeight: 700,
                      pointerEvents: 'none',
                    }}
                  />
                </Pie>
                <Tooltip content={<FundingPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Legend aligned center vertically with the chart */}
        <ul className="flex-1 flex flex-col gap-5 justify-center min-h-[160px]">
          {fundingBreakdown.map((b) => (
            <li key={b.label} className="flex items-center justify-between text-base">
              <div className="flex items-center">
                <LegendDot color={b.color} />
                <span className="text-gray-800 font-medium">{b.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-gray-900 font-bold">${b.amount.toLocaleString()}</span>
                <span className="text-gray-400 text-sm">({b.percent}%)</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FundingNeeds;
