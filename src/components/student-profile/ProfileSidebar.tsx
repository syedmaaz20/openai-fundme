
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Share2, Settings, TrendingUp, Users, DollarSign, Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ProfileSidebarProps {
  profileData: any;
  onUpdate: (updates: any) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profileData, onUpdate }) => {
  const navigate = useNavigate();

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
    // Navigate to campaign detail page to show preview
    navigate(`/campaigns/${profileData.shareCode}`, { state: { preview: true } });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/c/${profileData.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share Link Copied!",
      description: shareUrl,
    });
  };

  const handleSupportingDocs = () => {
    toast({
      title: "Upload Documents",
      description: "Supporting documents upload feature coming soon",
    });
  };

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
            onClick={handleSupportingDocs}
            variant="outline" 
            className="w-full mb-2"
          >
            <Upload size={16} className="mr-2" />
            Supporting Documents
          </Button>

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
            <span className="font-medium">1,234</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-green-500" />
              <span className="text-sm">Supporters</span>
            </div>
            <span className="font-medium">23</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-yellow-500" />
              <span className="text-sm">Raised</span>
            </div>
            <span className="font-medium">$3,450</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-500" />
              <span className="text-sm">Progress</span>
            </div>
            <span className="font-medium">23%</span>
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

      {/* Donor Preview */}
      <div className="bg-white rounded-xl shadow border border-slate-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Donor Preview</h3>
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <img
            src={profileData.photo}
            alt={profileData.studentName}
            className="h-32 w-full object-cover rounded-lg mb-3"
          />
          <h4 className="font-bold text-lg text-gray-800 mb-1">{profileData.studentName}</h4>
          <div className="text-blue-600 text-sm font-semibold mb-2">
            Future Social Worker
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            I'm fundraising for my final year at UCLA. Your support will help pay my tuition...
          </p>
          <div className="flex gap-2 items-center text-xs mb-2">
            <DollarSign className="text-green-500" size={16} />
            <span className="font-semibold text-gray-800">$3,450</span>
            <span className="text-gray-500">/ ${profileData.goal.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded mb-2">
            <div className="h-full w-1/4 bg-gradient-to-r from-blue-500 to-green-400 rounded" />
          </div>
          <Button onClick={handlePreview} size="sm" className="w-full text-xs">
            Preview Full Campaign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
