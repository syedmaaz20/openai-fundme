
import React from "react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Share2, Heart, DollarSign, Edit3, BarChart3 } from "lucide-react";

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated or not a student
  if (!isAuthenticated || user?.userType !== 'student') {
    return <Navigate to="/" replace />;
  }

  // Mock campaign data
  const campaignStats = {
    raised: 8500,
    goal: 15000,
    views: 342,
    shares: 28,
    supporters: 15,
    daysLeft: 45
  };

  const progress = (campaignStats.raised / campaignStats.goal) * 100;

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-6xl mx-auto pt-8 px-4 lg:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">Here's how your campaign is performing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${campaignStats.raised.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {progress.toFixed(1)}% of ${campaignStats.goal.toLocaleString()} goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignStats.views}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supporters</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignStats.supporters}</div>
              <p className="text-xs text-muted-foreground">Amazing community!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shares</CardTitle>
              <Share2 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignStats.shares}</div>
              <p className="text-xs text-muted-foreground">Keep spreading the word!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Campaign Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress towards goal</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-green-400 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${campaignStats.raised.toLocaleString()} raised</span>
                    <span>${campaignStats.goal.toLocaleString()} goal</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Anonymous donation</span>
                      <span className="font-medium text-green-600">+$100</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>John S. donated</span>
                      <span className="font-medium text-green-600">+$250</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Campaign shared on social media</span>
                      <span className="text-blue-600">+3 views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Campaign
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Campaign
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Campaign
                </Button>
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-green-400 hover:scale-105 transition text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Update your story regularly to keep supporters engaged</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Share your campaign on social media at least twice a week</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Thank your supporters personally when possible</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
