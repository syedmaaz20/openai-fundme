
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { FileText, UserCheck, Upload, Check } from "lucide-react";

const steps = [
  {
    icon: <Upload className="text-blue-600" size={34} />,
    title: "Students Submit Applications",
    desc: "Students and their sponsors fill out a detailed application form on EduFund, providing personal, academic, and financial information.",
  },
  {
    icon: <FileText className="text-green-500" size={34} />,
    title: "Upload Supporting Documents",
    desc: "Applicants upload necessary supporting documents—such as academic transcripts, recommendation letters, and proof of income.",
  },
  {
    icon: <UserCheck className="text-sky-700" size={34} />,
    title: "Verification Process",
    desc: "Our team carefully verifies all submitted information and documentation for authenticity. We check academic records and eligibility to build trust with donors.",
    highlight: true,
  },
  {
    icon: <Check className="text-emerald-500" size={34} />,
    title: "Campaign Goes Live",
    desc: "Once applications are approved, a crowdfunding campaign is published for the student, making them discoverable by donors on the platform.",
  },
];

const HowItWorks = () => (
  <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col">
    <TopNav />
    <main className="flex-1 w-full flex flex-col items-center pt-8 px-4 lg:px-0">
      <section className="w-full max-w-3xl mx-auto pb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          How It Works
        </h1>
        <p className="text-lg text-gray-700 mb-10 text-center">
          EduFund connects underprivileged students with donors in a transparent, trusted, and simple way.
          Here’s how the process works—from application to successful fundraising.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((step, idx) => (
            <div key={idx} className={`bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-slate-100 ${step.highlight ? "ring-2 ring-blue-200" : ""}`}>
              <div className="mb-4">{step.icon}</div>
              <h2 className="font-bold text-xl mb-2">{step.title}</h2>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="my-12 bg-green-50 border-l-4 border-green-400 p-6 rounded max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Verification Process</h2>
          <ul className="list-disc pl-5 text-left text-green-900 space-y-2">
            <li>
              <b>Document Authenticity:</b> Our review team checks the validity of uploaded academic credentials and background information.
            </li>
            <li>
              <b>Additional Checks:</b> We may contact educational institutions or references for further verification if needed.
            </li>
            <li>
              <b>Building Trust:</b> Only applications that pass our thorough checks are approved, so donors can be confident about who they support.
            </li>
          </ul>
        </div>
        <div className="text-center text-gray-700">
          <p>
            <span className="font-semibold">Ready to start?</span> Visit our Campaigns page to discover and support a student in need, or apply now if you are a student seeking help.
          </p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default HowItWorks;
