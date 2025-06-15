
// Types for campaign detail components and data

export interface FundingBreakdown {
  label: string;
  amount: number;
  percent: number;
  color: string;
  legend?: string;
}

export interface ImpactItem {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

export interface Supporter {
  name: string;
  amount: number;
  label?: string;
  avatarUrl?: string;
  time?: string;
  message?: string;
}

export interface Campaign {
  id: string;
  studentName: string;
  goal: number;
  raised: number;
  photo: string;
}

