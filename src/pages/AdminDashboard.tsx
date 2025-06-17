
import React, { useState } from "react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, Eye, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Mock data for student profiles pending verification
  const [pendingProfiles] = useState([
    {
      id: '1',
      studentName: 'Maria Rodriguez',
      email: 'maria@student.com',
      program: 'Social Work',
      institution: 'UCLA',
      goal: 15000,
      submittedAt: '2024-01-15',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b407?auto=format&fit=crop&w=150&h=150&q=80',
      story: 'First-generation college student from a low-income background...',
      status: 'pending'
    },
    {
      id: '2',
      studentName: 'James Chen',
      email: 'james@student.com',
      program: 'Computer Science',
      institution: 'Stanford University',
      goal: 20000,
      submittedAt: '2024-01-14',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      story: 'Passionate about technology and social impact...',
      status: 'pending'
    }
  ]);

  const [verifiedProfiles] = useState([
    {
      id: '3',
      studentName: 'Sarah Johnson',
      program: 'Nursing',
      institution: 'Johns Hopkins',
      goal: 18000,
      raised: 5400,
      verifiedAt: '2024-01-10',
      status: 'approved'
    }
  ]);

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || user?.userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleVerifyProfile = (profileId: string, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Profile Approved" : "Profile Rejected",
      description: `Student profile has been ${action}d and ${action === 'approve' ? 'is now live' : 'sent back for revision'}.`,
    });
  };

  const adminStats = {
    totalStudents: 45,
    pendingReviews: pendingProfiles.length,
    totalRaised: 125000,
    activeAampaigns: 28
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-7xl mx-auto pt-8 px-4 lg:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage student verifications and platform oversight</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{adminStats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${adminStats.totalRaised.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Platform-wide</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats.activeAampaigns}</div>
              <p className="text-xs text-muted-foreground">Currently fundraising</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Reviews ({pendingProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="verified">
              Verified Profiles ({verifiedProfiles.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {pendingProfiles.map((profile) => (
              <Card key={profile.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <img
                        src={profile.photo}
                        alt={profile.studentName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <CardTitle className="text-lg">{profile.studentName}</CardTitle>
                        <p className="text-gray-600">{profile.program} at {profile.institution}</p>
                        <p className="text-sm text-gray-500">Goal: ${profile.goal.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Submitted: {profile.submittedAt}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-orange-200 text-orange-700">
                      <Clock size={12} className="mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Student Story:</h4>
                    <p className="text-gray-700 text-sm">{profile.story}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleVerifyProfile(profile.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleVerifyProfile(profile.id, 'reject')}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline">
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="verified" className="space-y-6">
            {verifiedProfiles.map((profile) => (
              <Card key={profile.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{profile.studentName}</h3>
                      <p className="text-gray-600 text-sm">{profile.program} at {profile.institution}</p>
                      <p className="text-xs text-gray-500">Verified: {profile.verifiedAt}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${profile.raised?.toLocaleString()} / ${profile.goal.toLocaleString()}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle size={12} className="mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
