
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Supporter } from "@/types/campaign";

const wordsOfSupport: Supporter[] = [
  {
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Beth Bernstein",
    amount: 250,
    time: "3 d",
    message: `Michelle, Lili, and Lucas, There are no words that can express what I want to say. Please know that I am holding you in my heart, now and always. Michelle, you are always the first one to help others -- now it's your turn to let others help you. (And I know how hard that is for you.) May Andy's memory and legacy be a blessing. Love, Beth`,
  },
];

export default function WordsOfSupport() {
  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6 mt-2">
      <h2 className="text-lg font-semibold mb-1 text-gray-900 flex items-center gap-2">
        Words of support
        <span className="text-blue-700 font-normal text-base">({wordsOfSupport.length})</span>
      </h2>
      <div className="text-gray-500 text-sm mb-3">
        Please donate to share words of support.
      </div>
      <ul className="divide-y">
        {wordsOfSupport.map((ws, idx) => (
          <li key={idx} className="py-4 flex items-start gap-3">
            <Avatar className="w-10 h-10 mt-1">
              <AvatarImage src={ws.avatarUrl} alt={ws.name} />
              <AvatarFallback>{ws.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 items-center leading-tight mb-1">
                <span className="font-semibold text-gray-900">{ws.name}</span>
                <span className="text-gray-500 text-sm">${ws.amount} &middot; {ws.time}</span>
              </div>
              <div className="text-gray-800 text-[15px] leading-snug whitespace-pre-line break-words">
                {ws.message}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
