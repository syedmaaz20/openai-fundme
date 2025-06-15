
import React from "react";

const educationPath = [
  { label: "Program", value: "Social Work" },
  { label: "Institution", value: "University of California, Los Angeles" },
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
