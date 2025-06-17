import React, { useState } from "react";
import { Edit3, Check, X, Camera, Share2, Upload, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShareCampaign } from "@/hooks/useShareCampaign";
import { uploadImage } from "@/utils/supabaseStorage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ProfileData {
  studentName: string;
  photo: string;
  bannerUrl?: string;
  youtubeVideoUrl?: string;
  shareCode: string;
}

interface EditableProfileCardProps {
  data: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

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

// Helper to validate YouTube URL
const isValidYouTubeUrl = (url: string) => {
  if (!url.trim()) return true; // Empty URL is valid (optional)
  return getYoutubeId(url) !== "";
};

const EditableProfileCard: React.FC<EditableProfileCardProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [uploading, setUploading] = useState<'avatar' | 'banner' | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState(data.youtubeVideoUrl || '');
  const [videoUrlError, setVideoUrlError] = useState('');
  const share = useShareCampaign();
  const { user } = useAuth();

  const handleSave = () => {
    // Validate YouTube URL before saving
    if (videoUrlInput && !isValidYouTubeUrl(videoUrlInput)) {
      setVideoUrlError('Please enter a valid YouTube URL');
      return;
    }

    const updatedData = { ...editData, youtubeVideoUrl: videoUrlInput };
    onUpdate(updatedData);
    setIsEditing(false);
    setVideoUrlError('');
  };

  const handleCancel = () => {
    setEditData(data);
    setVideoUrlInput(data.youtubeVideoUrl || '');
    setVideoUrlError('');
    setIsEditing(false);
  };

  const handleVideoUrlChange = (value: string) => {
    setVideoUrlInput(value);
    if (videoUrlError && (value === '' || isValidYouTubeUrl(value))) {
      setVideoUrlError('');
    }
  };

  const handleImageUpload = async (file: File, type: 'avatar' | 'banner') => {
    if (!user?.id) return;

    try {
      setUploading(type);
      const bucket = type === 'avatar' ? 'avatars' : 'banners';
      const imageUrl = await uploadImage(file, bucket, user.id);
      
      const updateKey = type === 'avatar' ? 'photo' : 'bannerUrl';
      const newData = { ...editData, [updateKey]: imageUrl };
      setEditData(newData);
      
      toast({
        title: "Success",
        description: `${type === 'avatar' ? 'Profile' : 'Banner'} image uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload ${type} image`,
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const youtubeId = getYoutubeId(editData.youtubeVideoUrl);
  const hasVideo = !!youtubeId;

  return (
    <div className="bg-white p-0 pb-4 rounded-2xl shadow border border-slate-100 overflow-hidden">
      {/* Banner */}
      <div
        className="h-32 sm:h-48 w-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${editData.bannerUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"})`,
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
          <div className="absolute bottom-4 right-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'banner');
              }}
              className="hidden"
              id="banner-upload"
            />
            <Button
              size="sm"
              className="bg-white/80 text-gray-700 hover:bg-white"
              onClick={() => document.getElementById('banner-upload')?.click()}
              disabled={uploading === 'banner'}
            >
              {uploading === 'banner' ? (
                <Upload className="animate-spin" size={14} />
              ) : (
                <Camera size={14} />
              )}
              Banner
            </Button>
          </div>
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
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'avatar');
                }}
                className="hidden"
                id="avatar-upload"
              />
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploading === 'avatar'}
              >
                {uploading === 'avatar' ? (
                  <Upload className="animate-spin" size={14} />
                ) : (
                  <Camera size={14} />
                )}
              </Button>
            </>
          )}
        </div>

        <div className="flex flex-col justify-end flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editData.studentName}
                onChange={(e) => setEditData(prev => ({ ...prev, studentName: e.target.value }))}
                className="text-xl font-bold"
                placeholder="Your name"
              />
              <Button size="sm" onClick={handleSave}>
                <Check size={16} className="mr-1" />
                Save
              </Button>
            </div>
          ) : (
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
              <div>
                <button
                  className="text-blue-600 hover:underline text-sm mt-1 flex items-center gap-1"
                  onClick={() =>
                    share({
                      studentName: data.studentName,
                      shareCode: data.shareCode,
                    })
                  }
                >
                  <Share2 size={15} /> Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* YouTube Video URL Input (only show when editing) */}
      {isEditing && (
        <div className="mt-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              YouTube Video URL (optional)
            </label>
            <Input
              value={videoUrlInput}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={videoUrlError ? "border-red-500" : ""}
            />
            {videoUrlError && (
              <p className="text-red-500 text-sm">{videoUrlError}</p>
            )}
            {videoUrlInput && isValidYouTubeUrl(videoUrlInput) && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Play size={16} />
                <span>Valid YouTube URL - Video will be displayed below</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video/Story section - only show if video exists */}
      {hasVideo && (
        <div className="mt-4 px-2 sm:px-4">
          <div className="rounded-xl bg-gray-100 shadow-lg overflow-hidden relative flex items-center justify-center transition-all h-52 sm:h-80">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=0&loop=0&controls=1&modestbranding=1&rel=0`}
              title="Student video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              style={{ border: 0 }}
            ></iframe>
          </div>
        </div>
      )}

      {/* Placeholder when no video and not editing */}
      {!hasVideo && !isEditing && (
        <div className="mt-4 px-2 sm:px-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-200 p-8 text-center">
            <Play className="mx-auto h-12 w-12 text-blue-400 mb-3" />
            <p className="text-blue-600 font-medium">No video added yet</p>
            <p className="text-blue-500 text-sm mt-1">Click Edit to add a YouTube video</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableProfileCard;