import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface UserProfile {
  id: string;
  username?: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'donor' | 'admin';
  profile_picture_url?: string;
  banner_picture_url?: string;
  bio?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  student_id: string;
  title: string;
  description: string;
  story: string;
  goal_amount: number;
  raised_amount: number;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'completed';
  youtube_video_url?: string;
  share_code: string;
  program: string;
  institution: string;
  institution_url?: string;
  graduation_date?: string;
  funding_breakdown?: any;
  goals?: any;
  created_at: string;
  updated_at: string;
  published_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  student?: UserProfile;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_id?: string;
  amount: number;
  is_anonymous: boolean;
  message?: string;
  payment_intent_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  donor?: UserProfile;
  campaign?: Campaign;
}

export interface SupportingDocument {
  id: string;
  campaign_id: string;
  document_type: 'academic_transcript' | 'admission_letter' | 'financial_aid' | 'identity_proof' | 'other';
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
}

export interface CampaignUpdate {
  id: string;
  campaign_id: string;
  title: string;
  content: string;
  created_at: string;
}

// Helper functions for storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// Auth helpers
export const signUp = async (
  email: string,
  password: string,
  userData: {
    first_name: string;
    last_name: string;
    role: 'student' | 'donor' | 'admin';
    username?: string;
  }
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Database helpers
export const createUserProfile = async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createCampaign = async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'raised_amount'>) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCampaigns = async (status?: Campaign['status']) => {
  let query = supabase
    .from('campaigns')
    .select(`
      *,
      student:user_profiles(*)
    `);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getCampaignByShareCode = async (shareCode: string) => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      student:user_profiles(*)
    `)
    .eq('share_code', shareCode)
    .single();

  if (error) throw error;
  return data;
};

export const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', campaignId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createDonation = async (donation: Omit<Donation, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getDonations = async (campaignId?: string, donorId?: string) => {
  let query = supabase
    .from('donations')
    .select(`
      *,
      donor:user_profiles(*),
      campaign:campaigns(*)
    `);

  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }

  if (donorId) {
    query = query.eq('donor_id', donorId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};