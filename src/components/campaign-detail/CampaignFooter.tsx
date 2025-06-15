
import React from "react";

export default function CampaignFooter() {
  return (
    <footer className="w-full bg-gray-100/90 py-10 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-around items-center gap-6 rounded-2xl shadow-sm px-6">
        <div className="flex flex-col sm:flex-row gap-10 w-full justify-center text-center">
          <div>
            <span className="font-bold text-lg text-slate-900 block mb-1">Easy</span>
            <span className="text-gray-500 text-sm">Donate quickly and easily</span>
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 block mb-1">Powerful</span>
            <span className="text-gray-500 text-sm">Support students directly</span>
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 block mb-1">Trusted</span>
            <span className="text-gray-500 text-sm">Your donation is protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
