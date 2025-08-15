'use client';

import { useState, useEffect } from 'react';
import { Group } from '../lib/types';
import { addGroup, updateGroup } from '../lib/storage';

interface GroupFormProps {
  onSave: () => void;
  groupToEdit?: Group;
  onCancel: () => void;
}

const predefinedColors = [
  '#38bdf8', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export default function GroupForm({ onSave, groupToEdit, onCancel }: GroupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: '#38bdf8',
  });

  useEffect(() => {
    if (groupToEdit) {
      setFormData({
        name: groupToEdit.name,
        color: groupToEdit.color,
      });
    }
  }, [groupToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (groupToEdit) {
      updateGroup(groupToEdit.id, formData);
    } else {
      addGroup(formData);
    }
    
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="chart-container fade-in">
      <h3 className="text-2xl font-bold text-white mb-6">
        {groupToEdit ? 'Edit Group' : 'Add New Group'}
      </h3>
      
      <div className="form-group">
        <label htmlFor="name">Group Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter group name..."
          required
        />
      </div>

      <div className="form-group">
        <label>Group Color:</label>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-16 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
          />
          <div className="flex-1">
            <div className="text-sm text-gray-300 mb-2">Selected: <span className="font-mono">{formData.color}</span></div>
            <div 
              className="w-full h-8 rounded-lg border-2 border-gray-600"
              style={{ backgroundColor: formData.color }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {predefinedColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-10 h-10 rounded-lg border-2 transition-all ${
                formData.color === color 
                  ? 'border-white scale-110' 
                  : 'border-gray-600 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Preview:</h4>
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white"
            style={{ backgroundColor: formData.color }}
          />
          <span className="text-white font-medium">
            {formData.name || 'Unnamed Group'}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" className="btn btn-primary flex-1">
          {groupToEdit ? 'Update' : 'Add'} Group
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
