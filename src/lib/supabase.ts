
import { supabase } from '@/integrations/supabase/client';

// Re-export the supabase client
export { supabase };

// Types for our database - updated to match actual schema
export interface UserProfile {
  id: string;
  username?: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'donor' | 'admin';
  avatar_url?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  student_id: string;
  title: string;
  aspirational_title?: string;
  short_description?: string;
  story?: string;
  photo_url?: string;
  banner_url?: string;
  video_url?: string;
  goal: number;
  raised?: number;
  share_code: string;
  campaign_status: 'draft' | 'pending_review' | 'published' | 'rejected';
  education_program?: string;
  institution?: string;
  institution_url?: string;
  graduation_date?: string;
  created_at: string;
  updated_at: string;
  student?: UserProfile;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_id?: string;
  amount: number;
  is_anonymous: boolean;
  message?: string;
  created_at: string;
  donor?: UserProfile;
  campaign?: Campaign;
}

export interface SupportingDocument {
  id: string;
  student_id: string;
  file_name: string;
  file_url: string;
  document_type?: string;
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
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

export const getPublicUrl = (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Get public URL error:', error);
    throw error;
  }
};

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Storage delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

// Auth helpers
export const signUp = async (
  email: string,
  password: string,
  userData: {
    first_name: string;
    last_name: string;
    user_type: 'student' | 'donor' | 'admin';
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

  if (error) {
    if (error.message === 'Email not confirmed') {
      throw new Error('Please confirm your email address. Check your inbox for a verification link.');
    }
    throw error;
  }
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

// Database helpers - updated to use correct table name 'profiles'
export const createUserProfile = async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createCampaign = async (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'raised'>) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCampaigns = async (status?: Campaign['campaign_status']) => {
  let query = supabase
    .from('campaigns')
    .select(`
      *,
      student:profiles(*)
    `);

  if (status) {
    query = query.eq('campaign_status', status);
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
      student:profiles(*)
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
      donor:profiles(*),
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
