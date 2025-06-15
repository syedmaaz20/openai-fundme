
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const StartCampaign = () => {
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");
  const [institution, setInstitution] = useState("");
  const [goal, setGoal] = useState("");
  const [story, setStory] = useState("");

  // Fake submit handler for now, could integrate backend later.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Campaign submitted!\n(This is just a placeholder. Connect to backend to store data.)");
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-white min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg mt-14 mb-10 bg-white rounded-xl shadow border border-slate-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Start a Campaign
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <Input
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Program of Study
            </label>
            <Input
              value={program}
              onChange={e => setProgram(e.target.value)}
              placeholder="e.g. Computer Science"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution
            </label>
            <Input
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              placeholder="University or College name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fundraising Goal (USD)
            </label>
            <Input
              type="number"
              value={goal}
              min={1}
              onChange={e => setGoal(e.target.value)}
              placeholder="Amount needed"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Story
            </label>
            <Textarea
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="Share a few paragraphs about your journey, your aspirations, and why you're seeking support."
              rows={5}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base py-2 font-semibold rounded-lg">
            Submit Campaign
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StartCampaign;
