
import { Book } from "lucide-react";

const HeroSection = () => (
  <section className="w-full flex flex-col lg:flex-row items-center gap-10 mb-8 animate-fade-in">
    <div className="flex-1 text-center lg:text-left space-y-6">
      <span className="inline-flex items-center bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
        <Book className="mr-2" size={18} /> Crowdfunding for Underprivileged Students
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-gray-800">
        Empower a Student's Tomorrow <br className="hidden md:inline" />
        <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Make Education Possible
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
        Support talented students from marginalized communities by contributing to crowdfunding campaigns that make their education dreams a reality.
      </p>
      <a
        href="#campaigns"
        className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition hover:bg-blue-700 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        Browse Campaigns
      </a>
    </div>
    <div className="flex-1 flex justify-center lg:justify-end">
      <img
        src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80"
        alt="Student learning on laptop"
        className="rounded-xl shadow-lg w-full max-w-[400px] object-cover animate-scale-in"
        loading="lazy"
      />
    </div>
  </section>
);

export default HeroSection;
