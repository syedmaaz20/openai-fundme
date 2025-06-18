import React from "react";
import TopNav from "@/components/TopNav";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, Users, TrendingUp, Search, Filter } from "lucide-react";

const DonorDashboard = () => {
  const { user, profile, isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  // Redirect if not authenticated or not a donor
  if (!isAuthenticated || !user || profile?.user_type !== 'donor') {
    return <Navigate to="/" replace />;
  }

  // Mock donation data
  const donationStats = {
    totalDonated: 2750,
    studentsSupported: 8,
    activeCampaigns: 5,
    impactScore: 94
  };

  const recentDonations = [
    { student: "Maria Rodriguez", amount: 250, program: "Social Work", date: "2 days ago" },
    { student: "James Chen", amount: 150, program: "Computer Science", date: "1 week ago" },
    { student: "Sarah Johnson", amount: 300, program: "Nursing", date: "2 weeks ago" },
  ];

  const recommendedCampaigns = [
    { 
      name: "Alex Thompson", 
      program: "Environmental Science", 
      goal: 12000, 
      raised: 3400, 
      story: "Passionate about climate change research..."
    },
    { 
      name: "Maya Patel", 
      program: "Medicine", 
      goal: 25000, 
      raised: 8900, 
      story: "First-generation medical student from rural community..."
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-6xl mx-auto pt-8 px-4 lg:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.first_name || user.email}! 🌟
          </h1>
          <p className="text-gray-600">Your generosity is changing lives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${donationStats.totalDonated.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Incredible impact!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Supported</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donationStats.studentsSupported}</div>
              <p className="text-xs text-muted-foreground">Future leaders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donationStats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">Currently supporting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{donationStats.impactScore}%</div>
              <p className="text-xs text-muted-foreground">Amazing contributor!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDonations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{donation.student}</h4>
                        <p className="text-sm text-gray-600">{donation.program}</p>
                        <p className="text-xs text-gray-500">{donation.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${donation.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Donations
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recommended Campaigns
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recommendedCampaigns.map((campaign, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-gray-600">{campaign.program}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            ${campaign.raised.toLocaleString()} of ${campaign.goal.toLocaleString()}
                          </p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-green-400 h-2 rounded-full" 
                              style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{campaign.story}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-400">
                          Donate Now
                        </Button>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
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
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-green-400 hover:scale-105 transition text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Find New Campaigns
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  My Favorites
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Impact Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Student Updates
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                    <div className="text-sm text-gray-600">Students Helped</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">3</div>
                    <div className="text-sm text-gray-600">Graduates Supported</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2 text-sm">Recent Updates</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p>• Maria graduated with honors!</p>
                    <p>• James started his internship</p>
                    <p>• Sarah passed her boards</p>
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

export default DonorDashboard;