import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          user_type: 'student' | 'donor' | 'admin'
          avatar_url?: string
          banner_url?: string
          youtube_video_url?: string
          story?: string
          education_path?: any
          funding_needs?: any[]
          goals?: any[]
          share_code?: string
          campaign_published: boolean
          funding_goal?: number
          funding_raised: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          user_type: 'student' | 'donor' | 'admin'
          avatar_url?: string
          banner_url?: string
          youtube_video_url?: string
          story?: string
          education_path?: any
          funding_needs?: any[]
          goals?: any[]
          share_code?: string
          campaign_published?: boolean
          funding_goal?: number
          funding_raised?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          user_type?: 'student' | 'donor' | 'admin'
          avatar_url?: string
          banner_url?: string
          youtube_video_url?: string
          story?: string
          education_path?: any
          funding_needs?: any[]
          goals?: any[]
          share_code?: string
          campaign_published?: boolean
          funding_goal?: number
          funding_raised?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}