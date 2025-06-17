
import React, { useState } from "react";
import { Edit3, Check, X, Plus, Trash2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Goal {
  title: string;
  description: string;
  completed: boolean;
}

interface EditableGoalsProps {
  goals: Goal[];
  onUpdate: (goals: Goal[]) => void;
}

const EditableGoals: React.FC<EditableGoalsProps> = ({ goals, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editGoals, setEditGoals] = useState(goals);

  const handleSave = () => {
    onUpdate(editGoals);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditGoals(goals);
    setIsEditing(false);
  };

  const updateGoal = (index: number, field: string, value: any) => {
    const newGoals = [...editGoals];
    newGoals[index] = { ...newGoals[index], [field]: value };
    setEditGoals(newGoals);
  };

  const addGoal = () => {
    const newGoal: Goal = {
      title: 'New Goal',
      description: 'Goal description',
      completed: false
    };
    setEditGoals([...editGoals, newGoal]);
  };

  const removeGoal = (index: number) => {
    setEditGoals(editGoals.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">My Goals</h2>
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
          <div className="flex justify-between items-center">
            <Label>Goals</Label>
            <Button size="sm" onClick={addGoal}>
              <Plus size={16} className="mr-1" />
              Add Goal
            </Button>
          </div>
          
          {editGoals.map((goal, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Goal title"
                    value={goal.title}
                    onChange={(e) => updateGoal(index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Goal description"
                    value={goal.description}
                    onChange={(e) => updateGoal(index, 'description', e.target.value)}
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={(e) => updateGoal(index, 'completed', e.target.checked)}
                    />
                    <span className="text-sm">Completed</span>
                  </label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeGoal(index)}
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          <Button onClick={handleSave} className="w-full">
            <Check size={16} className="mr-2" />
            Save Goals
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {goals.map((goal, index) => (
            <li key={index} className="flex items-start gap-3">
              <Target 
                size={20} 
                className={goal.completed ? "text-green-500 mt-0.5" : "text-gray-400 mt-0.5"} 
              />
              <div className="flex-1">
                <div className={`font-medium ${goal.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                  {goal.title}
                </div>
                <div className="text-sm text-gray-600">{goal.description}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default EditableGoals;
