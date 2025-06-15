
// Utility functions for Campaign Detail

import { FundingBreakdown } from "@/types/campaign";

export function getPercent(raised: number, goal: number) {
  return Math.min(Math.round((raised / goal) * 100), 100);
}

export function getFundingBreakdown(): FundingBreakdown[] {
  return [
    {
      label: "Tuition",
      amount: 10000,
      percent: 66.7,
      color: "#60a5fa",
      legend: "bg-blue-400",
    },
    {
      label: "Books & Supplies",
      amount: 2000,
      percent: 13.3,
      color: "#7dd3fc",
      legend: "bg-sky-300",
    },
    {
      label: "Living Expenses",
      amount: 3000,
      percent: 20.0,
      color: "#6ee7b7",
      legend: "bg-green-300",
    },
  ];
}

