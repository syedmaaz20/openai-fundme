
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import CampaignList from "@/components/CampaignList";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { Book } from "lucide-react";

const campaignCategories = [
  "Medicine",
  "Engineering",
  "Arts",
  "Science",
  "Humanities",
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Donor",
    message: `“EduFund makes it easy to directly support students. I love seeing the impact of my donations.”`,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Ethan Carter",
    role: "Student",
    message: `“Thanks to the generous donors, I am now on my way to medical school!”`,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

export default function Index() {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
        <HeroSection />
        <div className="w-full max-w-6xl mx-auto mt-10">
          <StatsSection />
        </div>

        {/* --- Active Campaigns Section --- */}
        <section
          className="w-full relative max-w-6xl mx-auto mt-12 mb-12 px-2 lg:px-0"
          id="campaigns"
        >
          {/* Section Header with category pills */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
                Featured Students
              </h2>
              <div className="text-base text-gray-600 mb-2">
                Aspiring scholars ready for your support!
              </div>
            </div>
            {/* Category pills (static for now) */}
            <div className="flex gap-2 mt-3 md:mt-0 flex-wrap">
              {campaignCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-1 bg-blue-50 rounded-full border text-blue-700 font-medium text-sm shadow-sm cursor-pointer hover:bg-blue-100 transition"
                  tabIndex={-1}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Campaign Grid */}
          <div className="mt-7 bg-white/70 rounded-2xl shadow px-2 sm:px-7 py-8">
            <CampaignList />
          </div>
        </section>

        {/* --- Testimonials & Transparency Banner --- */}
        <section className="w-full max-w-6xl mx-auto mb-14 grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* Testimonials */}
          <div className="col-span-2 bg-blue-50 rounded-2xl border border-blue-100 p-7">
            <h3 className="text-xl font-bold mb-3 text-slate-900">Testimonials</h3>
            <div className="flex flex-col sm:flex-row gap-5">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white shadow-sm rounded-xl w-full p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-xs text-blue-600">{t.role}</div>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{t.message}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Transparency Block */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-lg text-slate-900 mb-3">Transparency</h4>
              <div className="text-gray-600 text-sm mb-3">
                We ensure every donation reaches the intended student. Our platform is transparent, with regular updates on student progress and fund allocation.<br />
                We are committed to ethical practices and accountability.
              </div>
            </div>
            <a
              href="#"
              className="mt-2 text-blue-600 font-semibold hover:underline text-sm"
            >
              Learn More About Our Process
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
