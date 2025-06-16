import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Share2, Settings, TrendingUp, Users, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useShareCampaign } from "@/hooks/useShareCampaign";

interface ProfileSidebarProps {
  profileData: {
    studentName: string;
    photo: string;
    program: string;
    goal: number;
    raised: number;
    shareCode: string;
    campaignPublished: boolean;
  };
  onUpdate: (updates: any) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profileData, onUpdate }) => {
  const share = useShareCampaign();

  const handlePublishCampaign = () => {
    onUpdate({ campaignPublished: !profileData.campaignPublished });
    toast({
      title: profileData.campaignPublished ? "Campaign Unpublished" : "Campaign Published!",
      description: profileData.campaignPublished 
        ? "Your campaign is now private" 
        : "Your campaign is now live and visible to donors",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "This is how donors will see your campaign",
    });
  };

  const handleShare = () => {
    share({
      studentName: profileData.studentName,
      shareCode: profileData.shareCode,
    });
  };

  const progress = profileData.goal > 0 ? (profileData.raised / profileData.goal) * 100 : 0;

  return (
    <div className="sticky top-6 space-y-6">
      {/* Campaign Status */}
      <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Campaign Status</h3>
        <div className="space-y-4">
          <div className={`p-3 rounded-lg ${profileData.campaignPublished ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${profileData.campaignPublished ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="font-medium text-sm">
                {profileData.campaignPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {profileData.campaignPublished 
                ? 'Your campaign is live and visible to donors'
                : 'Complete your profile to publish your campaign'
              }
            </p>
          </div>

          <Button 
            onClick={handlePublishCampaign} 
            className="w-full bg-gradient-to-r from-blue-600 to-green-400"
          >
            {profileData.campaignPublished ? 'Unpublish' : 'Publish Campaign'}
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Campaign Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-blue-500" />
              <span className="text-sm">Views</span>
            </div>
            <span className="font-medium">0</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-green-500" />
              <span className="text-sm">Supporters</span>
            </div>
            <span className="font-medium">0</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-yellow-500" />
              <span className="text-sm">Raised</span>
            </div>
            <span className="font-medium">${profileData.raised.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-500" />
              <span className="text-sm">Progress</span>
            </div>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={handlePreview}>
            <Eye size={16} className="mr-2" />
            Preview Campaign
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={handleShare}>
            <Share2 size={16} className="mr-2" />
            Share Campaign
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Settings size={16} className="mr-2" />
            Campaign Settings
          </Button>
        </div>
      </div>

      {/* Campaign Preview */}
      <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Donor Preview</h3>
        <div className="text-center space-y-3">
          <img
            src={profileData.photo}
            alt={profileData.studentName}
            className="w-16 h-16 rounded-full mx-auto object-cover"
          />
          <div>
            <div className="font-medium text-sm">{profileData.studentName}</div>
            <div className="text-xs text-gray-500">{profileData.program}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-lg font-bold text-blue-600">${profileData.goal.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Goal</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;