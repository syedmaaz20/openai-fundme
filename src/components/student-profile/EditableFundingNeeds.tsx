
import React, { useState } from "react";
import { Edit3, Check, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FundingItem {
  label: string;
  amount: number;
  percent: number;
  color: string;
}

interface EditableFundingNeedsProps {
  goal: number;
  breakdown: FundingItem[];
  onUpdate: (data: { goal: number; fundingBreakdown: FundingItem[] }) => void;
}

const EditableFundingNeeds: React.FC<EditableFundingNeedsProps> = ({ goal, breakdown, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState(goal);
  const [editBreakdown, setEditBreakdown] = useState(breakdown);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

  const calculatePercentages = (items: FundingItem[], total: number) => {
    return items.map(item => ({
      ...item,
      percent: total > 0 ? Math.round((item.amount / total) * 100 * 10) / 10 : 0
    }));
  };

  const handleSave = () => {
    const totalAmount = editBreakdown.reduce((sum, item) => sum + item.amount, 0);
    const updatedBreakdown = calculatePercentages(editBreakdown, totalAmount);
    const newGoal = totalAmount > 0 ? totalAmount : editGoal;
    
    onUpdate({ 
      goal: newGoal, 
      fundingBreakdown: updatedBreakdown 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditGoal(goal);
    setEditBreakdown(breakdown);
    setIsEditing(false);
  };

  const updateBreakdownItem = (index: number, field: string, value: any) => {
    const newBreakdown = [...editBreakdown];
    newBreakdown[index] = { ...newBreakdown[index], [field]: value };
    setEditBreakdown(newBreakdown);
  };

  const addBreakdownItem = () => {
    const newItem: FundingItem = {
      label: 'New Item',
      amount: 0,
      percent: 0,
      color: colors[editBreakdown.length % colors.length]
    };
    setEditBreakdown([...editBreakdown, newItem]);
  };

  const removeBreakdownItem = (index: number) => {
    setEditBreakdown(editBreakdown.filter((_, i) => i !== index));
  };

  return (
    <section className="bg-white rounded-xl shadow border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Funding Needs</h2>
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
            <Label htmlFor="goal">Funding Goal ($)</Label>
            <Input
              id="goal"
              type="number"
              value={editGoal}
              onChange={(e) => setEditGoal(Number(e.target.value))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Funding Breakdown</Label>
              <Button size="sm" onClick={addBreakdownItem}>
                <Plus size={16} className="mr-1" />
                Add Item
              </Button>
            </div>
            
            {editBreakdown.map((item, index) => (
              <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <Input
                    placeholder="Category"
                    value={item.label}
                    onChange={(e) => updateBreakdownItem(index, 'label', e.target.value)}
                    className="mb-2"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => updateBreakdownItem(index, 'amount', Number(e.target.value))}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeBreakdownItem(index)}
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={handleSave} className="w-full">
            <Check size={16} className="mr-2" />
            Save Funding Details
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">${goal.toLocaleString()}</div>
            <div className="text-gray-500">Funding Goal</div>
          </div>
          
          <ul className="space-y-3">
            {breakdown.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-800 font-medium">{item.label}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-gray-900 font-bold">${item.amount.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm">({item.percent}%)</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default EditableFundingNeeds;
