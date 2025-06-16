import React, { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import EditableProfileCard from "@/components/student-profile/EditableProfileCard";
import EditableEducationPath from "@/components/student-profile/EditableEducationPath";
import EditableStory from "@/components/student-profile/EditableStory";
import EditableFundingNeeds from "@/components/student-profile/EditableFundingNeeds";
import EditableGoals from "@/components/student-profile/EditableGoals";
import ProfileSidebar from "@/components/student-profile/ProfileSidebar";
import { Loader2 } from "lucide-react";
import type { EducationData, FundingBreakdown, Goal } from "@/types/campaign";

interface ProfileData {
  studentName: string;
  photo: string;
  bannerUrl?: string;
  youtubeVideoUrl?: string;
  program: string;
  institution: string;
  institutionUrl?: string;
  graduationDate: string;
  story: string;
  goal: number;
  raised: number;
  fundingBreakdown: FundingBreakdown[];
  goals: Goal[];
  campaignPublished: boolean;
  shareCode: string;
}

const StudentProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated or not a student
  if (!isAuthenticated || user?.userType !== 'student') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
    }
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) {
        throw error;
      }

      if (profile) {
        // Parse education_path
        const educationPath = profile.education_path || {};
        
        // Parse funding_needs
        const fundingNeeds = profile.funding_needs || [];
        
        // Parse goals
        const goals = profile.goals || [];

        setProfileData({
          studentName: `${profile.first_name} ${profile.last_name}`,
          photo: profile.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b407?auto=format&fit=crop&w=150&h=150&q=80',
          bannerUrl: profile.banner_url,
          youtubeVideoUrl: profile.youtube_video_url,
          program: educationPath.program || '',
          institution: educationPath.institution || '',
          institutionUrl: educationPath.institutionUrl || '',
          graduationDate: educationPath.graduationDate || '',
          story: profile.story || '',
          goal: profile.funding_goal || 0,
          raised: profile.funding_raised || 0,
          fundingBreakdown: fundingNeeds,
          goals: goals,
          campaignPublished: profile.campaign_published || false,
          shareCode: profile.share_code || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<ProfileData>) => {
    try {
      const updateData: any = {};

      // Handle basic profile updates
      if (updates.photo !== undefined) {
        updateData.avatar_url = updates.photo;
      }
      if (updates.bannerUrl !== undefined) {
        updateData.banner_url = updates.bannerUrl;
      }
      if (updates.youtubeVideoUrl !== undefined) {
        updateData.youtube_video_url = updates.youtubeVideoUrl;
      }
      if (updates.story !== undefined) {
        updateData.story = updates.story;
      }
      if (updates.goal !== undefined) {
        updateData.funding_goal = updates.goal;
      }
      if (updates.campaignPublished !== undefined) {
        updateData.campaign_published = updates.campaignPublished;
      }

      // Handle education path updates
      if (updates.program !== undefined || updates.institution !== undefined || 
          updates.graduationDate !== undefined || updates.institutionUrl !== undefined) {
        const currentEducationPath = profileData?.program ? {
          program: profileData.program,
          institution: profileData.institution,
          graduationDate: profileData.graduationDate,
          institutionUrl: profileData.institutionUrl
        } : {};

        updateData.education_path = {
          ...currentEducationPath,
          ...(updates.program !== undefined && { program: updates.program }),
          ...(updates.institution !== undefined && { institution: updates.institution }),
          ...(updates.graduationDate !== undefined && { graduationDate: updates.graduationDate }),
          ...(updates.institutionUrl !== undefined && { institutionUrl: updates.institutionUrl })
        };
      }

      // Handle funding breakdown updates
      if (updates.fundingBreakdown !== undefined) {
        updateData.funding_needs = updates.fundingBreakdown;
      }

      // Handle goals updates
      if (updates.goals !== undefined) {
        updateData.goals = updates.goals;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user!.id);

      if (error) {
        throw error;
      }

      // Update local state
      setProfileData(prev => prev ? { ...prev, ...updates } : null);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading profile...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
            <p className="text-gray-600">Unable to load your profile data.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-6 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-10 mb-12">
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <EditableProfileCard 
              data={{
                studentName: profileData.studentName,
                photo: profileData.photo,
                bannerUrl: profileData.bannerUrl,
                youtubeVideoUrl: profileData.youtubeVideoUrl,
                shareCode: profileData.shareCode
              }}
              onUpdate={handleUpdateProfile}
            />
            <EditableStory 
              story={profileData.story}
              onUpdate={(story) => handleUpdateProfile({ story })}
            />
            <EditableEducationPath 
              data={{
                program: profileData.program,
                institution: profileData.institution,
                institutionUrl: profileData.institutionUrl,
                graduationDate: profileData.graduationDate
              }}
              onUpdate={(educationData) => handleUpdateProfile(educationData)}
            />
            <EditableFundingNeeds 
              goal={profileData.goal}
              breakdown={profileData.fundingBreakdown}
              onUpdate={(fundingData) => handleUpdateProfile(fundingData)}
            />
            <EditableGoals 
              goals={profileData.goals}
              onUpdate={(goals) => handleUpdateProfile({ goals })}
            />
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <ProfileSidebar 
              profileData={profileData}
              onUpdate={handleUpdateProfile}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;