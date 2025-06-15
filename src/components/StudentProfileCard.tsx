
import { Share } from "lucide-react";
import React from "react";

type Props = {
  studentName: string;
  photo: string;
  program?: string;
  institution?: string;
  gradDate?: string;
  isVerified?: boolean;
  onShare?: () => void;
};

const StudentProfileCard = ({
  studentName,
  photo,
  program,
  institution,
  gradDate,
  isVerified = true,
  onShare,
}: Props) => (
  <section className="w-full rounded-2xl bg-white/70 shadow flex flex-col items-center gap-4 p-6 mb-7 relative border border-gray-100">
    {/* Soft background gradient shape for visual interest */}
    <div className="absolute inset-0 rounded-2xl overflow-hidden z-0 pointer-events-none">
      <div className="w-full h-full bg-gradient-to-tl from-blue-50/40 via-white to-green-50/30" />
    </div>
    <img
      src={photo}
      alt={studentName}
      className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow z-10 mb-2"
    />
    <div className="z-10 flex flex-col items-center">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-900">
        {studentName}
        {isVerified && (
          <span className="inline-block ml-1 bg-blue-100 rounded-full">
            <svg
              className="inline-block text-blue-600"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 13l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </span>
        )}
      </div>
      {onShare && (
        <button
          onClick={onShare}
          className="flex items-center text-blue-600 text-sm font-medium mt-1 hover:underline transition z-10"
          type="button"
        >
          <Share className="mr-1" size={17} />
          Share
        </button>
      )}
      <div className="mt-2 text-gray-700 text-sm flex flex-col gap-0.5">
        {program && (
          <span>
            <span className="font-medium">Program:</span> {program}
          </span>
        )}
        {institution && (
          <span>
            <span className="font-medium">Institution:</span> {institution}
          </span>
        )}
        {gradDate && (
          <span>
            <span className="font-medium">Graduation:</span> {gradDate}
          </span>
        )}
      </div>
    </div>
  </section>
);

export default StudentProfileCard;
