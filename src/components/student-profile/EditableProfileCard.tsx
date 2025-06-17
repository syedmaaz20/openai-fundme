
import React, { useState } from "react";
import { Edit3, Check, X, Camera, Share2, Youtube, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShareCampaign } from "@/hooks/useShareCampaign";
import { toast } from "@/hooks/use-toast";

interface ProfileData {
  studentName: string;
  photo: string;
  shareCode: string;
  videoUrl?: string;
  bannerImage?: string;
}

interface EditableProfileCardProps {
  data: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const EditableProfileCard: React.FC<EditableProfileCardProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [videoPreview, setVideoPreview] = useState(data.videoUrl || '');
  const share = useShareCampaign();

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setVideoPreview(data.videoUrl || '');
    setIsEditing(false);
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoPreview(url);
    setEditData(prev => ({ ...prev, videoUrl: url }));
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : '';
  };

  const handlePreview = () => {
    toast({
      title: "Campaign Preview",
      description: "This is how your campaign will appear to donors",
    });
  };

  return (
    <div className="bg-white p-0 pb-4 rounded-2xl shadow border border-slate-100 overflow-hidden">
      {/* Banner */}
      <div
        className="h-32 sm:h-48 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${editData.bannerImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"})`,
        }}
      >
        <div className="h-full w-full bg-gradient-to-b from-white/20 via-transparent to-white/80"></div>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-white/80"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X size={16} /> : <Edit3 size={16} />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 right-4 bg-white/80"
          >
            <Camera size={16} className="mr-1" />
            Change Banner
          </Button>
        )}
      </div>

      {/* Student profile */}
      <div className="-mt-12 sm:-mt-14 px-4 flex items-end gap-4">
        <div className="relative">
          <img
            src={editData.photo}
            alt={editData.studentName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover shadow-lg"
          />
          {isEditing && (
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
            >
              <Camera size={14} />
            </Button>
          )}
        </div>

        <div className="flex flex-col justify-end flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xl text-gray-900">
                {data.studentName}
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
            <div className="flex gap-4 mt-1">
              <button
                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                onClick={() =>
                  share({
                    studentName: data.studentName,
                    shareCode: data.shareCode,
                  })
                }
              >
                <Share2 size={15} /> Share
              </button>
              <button
                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                onClick={handlePreview}
              >
                <Eye size={15} /> Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video/Story section */}
      <div className="mt-4 px-2 sm:px-4">
        {isEditing && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Youtube size={16} className="inline mr-1" />
              YouTube Video URL
            </label>
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoPreview}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              className="mb-2"
            />
            {videoPreview && getYouTubeEmbedUrl(videoPreview) && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Video Preview:</p>
                <iframe
                  src={getYouTubeEmbedUrl(videoPreview)}
                  className="w-full h-48 rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
        
        <div
          className="rounded-xl bg-gray-100 shadow-lg overflow-hidden relative flex items-center justify-center transition-all h-52 sm:h-80"
          style={{
            minHeight: "208px",
            background: data.videoUrl && getYouTubeEmbedUrl(data.videoUrl) 
              ? "transparent" 
              : "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
          }}
        >
          {data.videoUrl && getYouTubeEmbedUrl(data.videoUrl) ? (
            <iframe
              src={getYouTubeEmbedUrl(data.videoUrl)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={data.photo}
              alt="Student profile"
              className="object-cover h-full w-full"
            />
          )}
        </div>
        
        {isEditing && (
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} className="flex-1">
              <Check size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableProfileCard;
