
import React, { useState } from "react";
import { Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditableStoryProps {
  story: string;
  onUpdate: (story: string) => void;
}

const EditableStory: React.FC<EditableStoryProps> = ({ story, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStory, setEditStory] = useState(story);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onUpdate(editStory);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditStory(story);
    setIsEditing(false);
  };

  // Check if story is long enough to need read more
  const isLongStory = story.length > 200;
  const displayStory = isExpanded || !isLongStory ? story : story.substring(0, 200) + "...";

  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Why I Need Support</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X size={16} /> : <Edit3 size={16} />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editStory}
            onChange={(e) => setEditStory(e.target.value)}
            className="w-full min-h-[120px] p-3 border rounded-md resize-none"
            placeholder="Tell your story..."
          />
          <Button onClick={handleSave} className="w-full">
            <Check size={16} className="mr-2" />
            Save Story
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 mb-2">{displayStory}</p>
          {isLongStory && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default EditableStory;
