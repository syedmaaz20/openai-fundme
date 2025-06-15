
import { Book } from "lucide-react";

const HeroSection = () => (
  <section className="w-full bg-blue-50 rounded-xl py-12 px-3 flex items-center justify-center min-h-[65vh] overflow-x-hidden">
    <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
      {/* Text left or on top */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
        <span className="inline-flex items-center bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-full text-sm mb-6">
          <Book className="mr-2" size={20} /> Crowdfunding for Underprivileged Students
        </span>
        <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl mb-3 leading-tight" style={{ lineHeight: '1.1' }}>
          Empower a Student's Tomorrow
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Make Education Possible
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-7">
          Support talented students from marginalized communities by contributing to crowdfunding campaigns that make their education dreams a reality.
        </p>
        <a
          href="#campaigns"
          className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg shadow-md transition hover:bg-blue-700 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-300 text-lg"
        >
          Browse Campaigns
        </a>
      </div>
      {/* Image right, only show on lg and up */}
      <div className="flex w-full justify-center lg:justify-end mt-10 lg:mt-0">
        <img
          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=700&q=80"
          alt="Student learning on laptop"
          className="rounded-2xl shadow-xl w-full max-w-[420px] min-h-[260px] object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;

