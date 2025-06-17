
import React, { useState } from "react";
import { Edit3, Check, X, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface EducationData {
  program: string;
  institution: string;
  graduationDate: string;
  institutionUrl?: string;
}

interface EditableEducationPathProps {
  data: EducationData;
  onUpdate: (data: EducationData) => void;
}

const EditableEducationPath: React.FC<EditableEducationPathProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    ...data,
    institutionUrl: data.institutionUrl || 'https://www.ucla.edu/'
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      ...data,
      institutionUrl: data.institutionUrl || 'https://www.ucla.edu/'
    });
    setIsEditing(false);
  };

  const educationPath = [
    { label: "Program", value: editData.program, field: "program" },
    { 
      label: "Institution", 
      value: editData.institution,
      field: "institution",
      hasLink: true
    },
    { label: "Graduation Date", value: editData.graduationDate, field: "graduationDate" }
  ];

  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Education Path</h2>
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
          {educationPath.map((item, i) => (
            <div key={i} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{item.label}</label>
              <Input
                value={editData[item.field as keyof EducationData] as string}
                onChange={(e) => setEditData(prev => ({ ...prev, [item.field]: e.target.value }))}
                placeholder={`Enter ${item.label.toLowerCase()}`}
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Institution Website</label>
            <Input
              value={editData.institutionUrl}
              onChange={(e) => setEditData(prev => ({ ...prev, institutionUrl: e.target.value }))}
              placeholder="Enter institution website URL"
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            <Check size={16} className="mr-2" />
            Save Education Path
          </Button>
        </div>
      ) : (
        <div className="divide-y">
          {educationPath.map((item, i) => (
            <div key={i} className="flex justify-between py-2 text-gray-700 text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-right">
                {item.hasLink ? (
                  <span className="flex items-center gap-1">
                    {item.value}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={editData.institutionUrl}
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
                ) : (
                  item.value
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EditableEducationPath;
