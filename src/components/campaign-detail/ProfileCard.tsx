
import React from "react";
import { toast } from "@/hooks/use-toast";
import { ArrowUp } from "lucide-react";

export default function ProfileCard({ campaign }: { campaign: { photo: string, studentName: string } }) {
  return (
    <div className="bg-white p-0 pb-4 rounded-2xl shadow border border-slate-100 overflow-hidden">
      {/* Banner */}
      <div className="h-32 sm:h-48 w-full bg-cover bg-center" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80)'
      }}>
        <div className="h-full w-full bg-gradient-to-b from-white/20 via-transparent to-white/80"></div>
      </div>
      {/* Student profile */}
      <div className="-mt-10 px-4 flex items-end gap-4">
        <img
          src={campaign.photo}
          alt={campaign.studentName}
          className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <div className="flex flex-col justify-end">
          <div className="flex items-center gap-1">
            <span className="font-bold text-xl text-gray-900">{campaign.studentName}</span>
            <span title="Verified student">
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3193ff"/><path d="M16 9l-4.2 6L8 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
          <div>
            <button
              className="text-blue-600 hover:underline text-sm mt-1 flex items-center gap-1"
              onClick={() => toast({ title: "Share", description: "Sharing feature coming soon!" })}
            >
              <ArrowUp className="rotate-45" size={15} /> Share
            </button>
          </div>
        </div>
      </div>
      {/* Video/Story image */}
      <div className="mt-4 px-4">
        <div className="rounded-lg bg-gray-100 h-44 flex items-center justify-center shadow-inner relative overflow-hidden">
          <img
            src={campaign.photo}
            alt="Student video"
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-white bg-opacity-60 rounded-full p-4 shadow-md">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#697386"><path d="M8 5v14l11-7z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
