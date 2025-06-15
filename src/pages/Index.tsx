
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CampaignList from "@/components/CampaignList";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
        <HeroSection />
        <div className="w-full max-w-6xl mx-auto mt-10">
          <StatsSection />
        </div>
        <section className="w-full max-w-6xl mx-auto mt-12 mb-8" id="campaigns">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">Active Campaigns</h2>
          <CampaignList />
        </section>
        {/* About Section */}
        <section
          id="about"
          className="w-full max-w-6xl mx-auto my-20 bg-white rounded-2xl shadow p-8 flex flex-col gap-4 items-start animate-fade-in"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About EduFund</h2>
          <p className="text-gray-700 text-base">
            EduFund is dedicated to bridging the financial gap for underprivileged students by connecting them with generous donors around the world. Our crowdfunding platform empowers students to pursue their educational dreams, making quality learning accessible to everyone regardless of background. Transparency, trust, and impact are at the core of everything we do. Join us and help shape brighter futures!
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

