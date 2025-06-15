
export interface Campaign {
  id: string;
  profile_id: string;
  title: string;
  short_description?: string;
  story?: string;
  photo_url: string;
  goal: number;
  raised: number;
  share_code: string;
  video_url?: string;
  created_at?: string;
  updated_at?: string;
  // Extended with profile data when joined
  profile?: {
    full_name: string;
    aspirational_title?: string;
    university?: string;
    bio?: string;
    avatar_url?: string;
  };
}

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
