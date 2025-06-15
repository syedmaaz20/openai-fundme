
import CampaignList from "@/components/CampaignList";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
      <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
        <section className="w-full max-w-2xl mx-auto mb-10 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Us</h1>
          <p className="text-gray-700 text-lg mb-4">
            EduFund is a crowdfunding platform dedicated to empowering underprivileged students with access to quality education. Our mission is to connect passionate donors with deserving students from marginalized communities, helping them achieve their educational aspirations.
          </p>
          <p className="text-gray-700 mb-2">
            We believe in the power of education to break the cycle of poverty and create lasting change. By supporting students through our campaigns, you are investing in brighter futures and stronger communities.
          </p>
          <p className="text-gray-700 mb-2">
            <strong>How it works:</strong> Anyone can start a campaign for a student in need or donate to an existing campaign. Every contribution brings a student closer to their dream—no matter how big or small.
          </p>
          <div className="my-8 bg-blue-100 border-l-4 border-blue-400 p-6 rounded">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Ready to Make a Difference?</h2>
            <p className="mb-2 text-blue-900">
              Browse active campaigns below and donate now. Your support changes lives, one student at a time.
            </p>
            <a
              href="#campaigns"
              className="inline-block bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition mt-2"
            >
              Donate Now
            </a>
          </div>
        </section>
        <section id="campaigns" className="w-full max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">Active Campaigns</h2>
          <CampaignList />
        </section>
      </main>
    </div>
  );
};

export default About;

