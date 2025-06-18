import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CampaignList from "@/components/CampaignList";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { loading, isAuthenticated, user } = useAuth();

  // Show loading spinner while checking session
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

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
        {/* Show personalized content if authenticated */}
        {isAuthenticated && user && (
          <div className="w-full max-w-6xl mx-auto mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome back, {user.email}! 👋
              </h2>
              <p className="text-gray-600">
                Continue making a difference in students' lives.
              </p>
            </div>
          </div>
        )}
        
        <HeroSection />
        <div className="w-full max-w-6xl mx-auto mt-10">
          <StatsSection />
        </div>
        <section className="w-full max-w-6xl mx-auto mt-12 mb-8" id="campaigns">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">Active Campaigns</h2>
          <CampaignList showAll={false} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;