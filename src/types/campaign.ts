export interface Campaign {
  id: string;
  studentName: string;
  goal: number;
  raised: number;
  photo: string;
  shareCode: string;
  videoUrl?: string;
  story?: string;
  bannerUrl?: string;
  educationPath?: EducationData;
  fundingNeeds?: FundingBreakdown[];
  goals?: Goal[];
  campaignPublished: boolean;
  aspirationalTitle?: string;
  shortDescription?: string;
  title?: string;
}

export interface FundingBreakdown {
  label: string;
  amount: number;
  percent: number;
  color: string;
}

export interface EducationData {
  program: string;
  institution: string;
  graduationDate: string;
  institutionUrl?: string;
}

export interface Goal {
  title: string;
  description: string;
  completed: boolean;
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