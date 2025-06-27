
import React, { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import { useMockData } from "@/contexts/MockDataContext";
import EditableProfileCard from "@/components/student-profile/EditableProfileCard";
import EditableEducationPath from "@/components/student-profile/EditableEducationPath";
import EditableStory from "@/components/student-profile/EditableStory";
import EditableFundingNeeds from "@/components/student-profile/EditableFundingNeeds";
import EditableGoals from "@/components/student-profile/EditableGoals";
import ProfileSidebar from "@/components/student-profile/ProfileSidebar";

const StudentProfile = () => {
  const { currentUser } = useMockData();
  const [profileData, setProfileData] = useState({
    studentName: '',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b407?auto=format&fit=crop&w=150&h=150&q=80',
    program: 'Social Work',
    institution: 'University of California, Los Angeles',
    institutionUrl: 'https://www.ucla.edu/',
    graduationDate: 'June 2025',
    story: "I'm a first-generation college student from a low-income background. My dream is to become a social worker and help others in my community. However, the financial burden of tuition and living expenses is making it difficult to continue my studies. Any support you can offer would mean the world to me and bring me closer to achieving my goals. Growing up in an underserved community, I witnessed firsthand the challenges that many families face. This experience has shaped my passion for social work and my commitment to making a positive impact in the lives of others.",
    goal: 15000,
    fundingBreakdown: [
      { label: 'Tuition', amount: 8000, percent: 53.3, color: '#3b82f6' },
      { label: 'Living Expenses', amount: 4000, percent: 26.7, color: '#10b981' },
      { label: 'Books & Supplies', amount: 2000, percent: 13.3, color: '#f59e0b' },
      { label: 'Other', amount: 1000, percent: 6.7, color: '#ef4444' }
    ],
    goals: [
      { title: 'Complete Degree', description: 'Graduate with Bachelor in Social Work', completed: false },
      { title: 'Maintain GPA', description: 'Keep GPA above 3.5', completed: true }
    ],
    campaignPublished: false,
    shareCode: currentUser.username || 'student-campaign'
  });

  // Update profile data when user loads
  useEffect(() => {
    if (currentUser) {
      setProfileData(prev => ({
        ...prev,
        studentName: `${currentUser.firstName} ${currentUser.lastName}`,
        photo: currentUser.avatar || prev.photo,
        shareCode: currentUser.username || `${currentUser.firstName}-${currentUser.lastName}`.toLowerCase().replace(/\s+/g, '-')
      }));
    }
  }, [currentUser]);

  const updateProfileData = (updates: Partial<typeof profileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-6 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-10 mb-12">
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <EditableProfileCard 
              data={profileData} 
              onUpdate={updateProfileData}
            />
            <EditableStory 
              story={profileData.story}
              onUpdate={(story) => updateProfileData({ story })}
            />
            <EditableEducationPath 
              data={{
                program: profileData.program,
                institution: profileData.institution,
                institutionUrl: profileData.institutionUrl,
                graduationDate: profileData.graduationDate
              }}
              onUpdate={(educationData) => updateProfileData(educationData)}
            />
            <EditableFundingNeeds 
              goal={profileData.goal}
              breakdown={profileData.fundingBreakdown}
              onUpdate={(fundingData) => updateProfileData(fundingData)}
            />
            <EditableGoals 
              goals={profileData.goals}
              onUpdate={(goals) => updateProfileData({ goals })}
            />
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <ProfileSidebar 
              profileData={profileData}
              onUpdate={updateProfileData}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
