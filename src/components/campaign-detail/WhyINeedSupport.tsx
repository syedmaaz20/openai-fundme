import React from "react";

interface WhyINeedSupportProps {
  story?: string;
}

export default function WhyINeedSupport({ story }: WhyINeedSupportProps) {
  const defaultStory = "I'm a first-generation college student from a low-income background. My dream is to become a social worker and help others in my community. However, the financial burden of tuition and living expenses is making it difficult to continue my studies. Any support you can offer would mean the world to me and bring me closer to achieving my goals.";

  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">Why I Need Support</h2>
      <p className="text-gray-700 mb-2">
        {story || defaultStory}
      </p>
    </section>
  );
}