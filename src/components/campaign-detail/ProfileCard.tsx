
import React from "react";
import { Share2 } from "lucide-react";
import { useShareCampaign } from "@/hooks/useShareCampaign";
import type { Campaign } from "@/types/campaign";

// Helper to extract the youtube video id from the url
const getYoutubeId = (url?: string) => {
  if (!url) return "";
  // Support both youtu.be and youtube.com URLs
  const match =
    url.match(
      /(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    ) ||
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
};

export default function ProfileCard({
  campaign,
}: {
  campaign: Partial<Campaign> & { photo: string; studentName: string; shareCode: string; videoUrl?: string };
}) {
  const share = useShareCampaign();
  const youtubeId = getYoutubeId(campaign.videoUrl);

  return (
    <div className="bg-white p-0 pb-4 rounded-2xl shadow border border-slate-100 overflow-hidden">
      {/* Banner */}
      <div
        className="h-32 sm:h-48 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80)",
        }}
      >
        <div className="h-full w-full bg-gradient-to-b from-white/20 via-transparent to-white/80"></div>
      </div>
      {/* Student profile */}
      <div className="-mt-12 sm:-mt-14 px-4 flex items-end gap-4">
        <img
          src={campaign.photo}
          alt={campaign.studentName}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover shadow-lg"
        />
        <div className="flex flex-col justify-end">
          <div className="flex items-center gap-1">
            <span className="font-bold text-xl text-gray-900">
              {campaign.studentName}
            </span>
            <span title="Verified student">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block ml-1"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" fill="#3193ff" />
                <path
                  d="M16 9l-4.2 6L8 13"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div>
            <button
              className="text-blue-600 hover:underline text-sm mt-1 flex items-center gap-1"
              onClick={() =>
                share({
                  studentName: campaign.studentName,
                  shareCode: campaign.shareCode,
                })
              }
            >
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>
      </div>
      {/* Video/Story section - autoplay YouTube embed, no overlay share button */}
      <div className="mt-4 px-4">
        <div className="rounded-lg bg-gray-100 h-44 flex items-center justify-center shadow-inner relative overflow-hidden">
          {youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0`}
              title="Student video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            ></iframe>
          ) : (
            <img
              src={campaign.photo}
              alt="Student video"
              className="object-cover h-full w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
