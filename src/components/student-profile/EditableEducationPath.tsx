
import React, { useState } from "react";
import { Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EducationData {
  program: string;
  institution: string;
  graduationDate: string;
}

interface EditableEducationPathProps {
  data: EducationData;
  onUpdate: (updates: EducationData) => void;
}

const EditableEducationPath: React.FC<EditableEducationPathProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

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
          <div>
            <Label htmlFor="program">Program</Label>
            <Input
              id="program"
              value={editData.program}
              onChange={(e) => setEditData(prev => ({ ...prev, program: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={editData.institution}
              onChange={(e) => setEditData(prev => ({ ...prev, institution: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="graduationDate">Graduation Date</Label>
            <Input
              id="graduationDate"
              value={editData.graduationDate}
              onChange={(e) => setEditData(prev => ({ ...prev, graduationDate: e.target.value }))}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            <Check size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="divide-y">
          <div className="flex justify-between py-2 text-gray-700 text-sm">
            <span className="font-medium">Program</span>
            <span className="text-right">{data.program}</span>
          </div>
          <div className="flex justify-between py-2 text-gray-700 text-sm">
            <span className="font-medium">Institution</span>
            <span className="text-right">{data.institution}</span>
          </div>
          <div className="flex justify-between py-2 text-gray-700 text-sm">
            <span className="font-medium">Graduation Date</span>
            <span className="text-right">{data.graduationDate}</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditableEducationPath;
