
import React from "react";
import { Link as LinkIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const educationPath = [
  { label: "Program", value: "Social Work" },
  { 
    label: "Institution", 
    value: (
      <span className="flex items-center gap-1">
        University of California, Los Angeles
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://www.ucla.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:text-blue-800"
              aria-label="Visit Institution Website"
            >
              <LinkIcon size={16} />
            </a>
          </TooltipTrigger>
          <TooltipContent side="top">
            Visit Institution Website
          </TooltipContent>
        </Tooltip>
      </span>
    ) 
  },
  { label: "Graduation Date", value: "June 2025" }
];

export default function EducationPath() {
  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">Education Path</h2>
      <div className="divide-y">
        {educationPath.map((item, i) => (
          <div key={i} className="flex justify-between py-2 text-gray-700 text-sm">
            <span className="font-medium">{item.label}</span>
            <span className="text-right">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
