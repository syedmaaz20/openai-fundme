import React, { useState } from "react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Check, X, Camera, Heart, Users, DollarSign, Eye, Settings, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DonorProfile = () => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: user?.email || '',
    avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    bio: profile?.bio || 'Passionate about supporting education and helping students achieve their dreams. I believe in the power of education to transform lives and communities.',
    location: profile?.location || 'San Francisco, CA',
    interests: profile?.interests || ['Education', 'Social Impact', 'Technology', 'Community Development'],
    totalDonated: 2750,
    studentsSupported: 8,
    yearsActive: 2
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const handleViewDonations = () => {
    toast({
      title: "Donation History",
      description: "View detailed donation history feature coming soon",
    });
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Profile Link Copied",
      description: "Your profile link has been copied to clipboard",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Profile Settings",
      description: "Profile settings page coming soon",
    });
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-6 px-2 sm:px-4 lg:px-0">
        <div className="w-full max-w-4xl mx-auto space-y-6 mb-12">
          {/* Profile Header */}
          <Card>
            <CardHeader className="relative">
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={profileData.avatar}
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                    >
                      <Camera size={14} />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="First Name"
                        />
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Last Name"
                        />
                      </div>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Email"
                        type="email"
                      />
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Location"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {profileData.firstName} {profileData.lastName}
                      </h1>
                      <p className="text-gray-600">{profileData.email}</p>
                      <p className="text-gray-500 text-sm">{profileData.location}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Heart size={12} className="mr-1" />
                          Generous Supporter
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleViewDonations} className="h-12">
              <Eye size={16} className="mr-2" />
              View Donations
            </Button>
            <Button variant="outline" onClick={handleShareProfile} className="h-12">
              <Share2 size={16} className="mr-2" />
              Share Profile
            </Button>
            <Button variant="outline" onClick={handleSettings} className="h-12">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
          </div>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself and why you support education..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-gray-700">{profileData.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  ${profileData.totalDonated.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Total Donated</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {profileData.studentsSupported}
                </div>
                <p className="text-sm text-gray-600">Students Supported</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-500">
                  {profileData.yearsActive}+
                </div>
                <p className="text-sm text-gray-600">Years Active</p>
              </CardContent>
            </Card>
          </div>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Areas of Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Check size={16} className="mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonorProfile;