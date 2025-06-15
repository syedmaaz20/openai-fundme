
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const donationChoices = [35, 50, 100];

export default function DonationOptions({ studentName, onDonate }: { studentName: string, onDonate: () => void }) {
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6 mb-2">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">Support {studentName}</h2>
      <div className="flex gap-3 mb-3">
        {donationChoices.map(choice => (
          <Button key={choice} size="sm" className="bg-blue-50 text-blue-700 border border-blue-400 hover:bg-blue-100 font-semibold px-5 rounded-md">{`$${choice}`}</Button>
        ))}
      </div>
      <input
        type="number"
        placeholder="Custom Amount"
        className="w-full border border-gray-200 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
        min={1}
      />
      <div className="flex flex-col gap-2 mb-3">
        {/* Recurring donation checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="recurring"
            className="accent-blue-500"
            checked={isRecurring}
            onChange={e => setIsRecurring(e.target.checked)}
          />
          <label htmlFor="recurring" className="text-sm text-gray-600">
            Make it a recurring donation
          </label>
          <Button
            variant="link"
            size="sm"
            className="ml-auto px-0 text-blue-500 hover:underline text-xs"
            onClick={() => toast({ title: "Matching Gift", description: "Matching gift feature coming soon!" })}
          >
            Match Gift?
          </Button>
        </div>
        {/* Anonymous donation checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous"
            className="accent-blue-500"
            checked={isAnonymous}
            onChange={e => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous" className="text-sm text-gray-600">
            Make it anonymous
          </label>
        </div>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 mt-2 rounded-xl text-base" onClick={onDonate}>
        Donate Now
      </Button>
    </section>
  );
}
