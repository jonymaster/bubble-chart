'use client';

import { useState, useEffect } from 'react';
import { Bubble, Group } from '../lib/types';
import { updateBubble } from '../lib/storage';

interface SimpleBubbleEditorProps {
  bubble: Bubble;
  groups: Group[];
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisMin: number;
  xAxisMax: number;
  yAxisMin: number;
  yAxisMax: number;
  onUpdate: () => void;
  onCancel: () => void;
}

export default function SimpleBubbleEditor({
  bubble,
  groups,
  xAxisLabel,
  yAxisLabel,
  xAxisMin,
  xAxisMax,
  yAxisMin,
  yAxisMax,
  onUpdate,
  onCancel
}: SimpleBubbleEditorProps) {
  const [formData, setFormData] = useState({
    name: bubble.name,
    x: bubble.x,
    y: bubble.y,
    size: bubble.size,
    group: bubble.group,
  });

  // Update form data when bubble changes
  useEffect(() => {
    setFormData({
      name: bubble.name,
      x: bubble.x,
      y: bubble.y,
      size: bubble.size,
      group: bubble.group,
    });
  }, [bubble]);

  const handleChange = (field: string, value: string | number) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };
    
    setFormData(newFormData);
    
    // Instant save - update bubble immediately
    updateBubble(bubble.id, { [field]: value });
    onUpdate();
  };

  const group = groups.find(g => g.id === formData.group);
  const bubbleColor = group?.color || '#6b7280';

  return (
            <div className="fixed top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-600 shadow-2xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Edit Bubble
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Bubble Name:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Group */}
          <div className="form-group">
            <label htmlFor="group">Group:</label>
            <select
              id="group"
              value={formData.group}
              onChange={(e) => handleChange('group', e.target.value)}
              className="w-full"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Position Controls */}
          <div className="grid grid-cols-1 gap-4">
            <div className="form-group">
              <label>
                {xAxisLabel}: <span className="text-indigo-400 font-semibold">{formData.x.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min={xAxisMin}
                max={xAxisMax}
                step="0.1"
                value={formData.x}
                onChange={(e) => handleChange('x', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{xAxisMin}</span>
                <span>{(xAxisMin + xAxisMax) / 2}</span>
                <span>{xAxisMax}</span>
              </div>
            </div>

            <div className="form-group">
              <label>
                {yAxisLabel}: <span className="text-indigo-400 font-semibold">{formData.y.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min={yAxisMin}
                max={yAxisMax}
                step="0.1"
                value={formData.y}
                onChange={(e) => handleChange('y', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{yAxisMin}</span>
                <span>{(yAxisMin + yAxisMax) / 2}</span>
                <span>{yAxisMax}</span>
              </div>
            </div>
          </div>

          {/* Size Control */}
          <div className="form-group">
            <label>
              Size: <span className="text-indigo-400 font-semibold">{formData.size.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={formData.size}
              onChange={(e) => handleChange('size', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Preview:</h4>
            <div className="flex items-center gap-4">
              <div 
                className="rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-xs"
                style={{
                  width: `${Math.max(20, formData.size / 3)}px`,
                  height: `${Math.max(20, formData.size / 3)}px`,
                  backgroundColor: bubbleColor
                }}
              >
                {formData.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-sm text-gray-300">
                <div><strong>Name:</strong> {formData.name}</div>
                <div><strong>Group:</strong> {group?.name || 'Unknown'}</div>
                <div><strong>Position:</strong> ({formData.x.toFixed(1)}, {formData.y.toFixed(1)})</div>
                <div><strong>Size:</strong> {formData.size.toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Quick Position Buttons */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Quick Position:</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleChange('x', xAxisMin)}
                className="btn btn-secondary text-xs py-2"
              >
                Left Edge
              </button>
              <button
                onClick={() => handleChange('x', xAxisMax)}
                className="btn btn-secondary text-xs py-2"
              >
                Right Edge
              </button>
              <button
                onClick={() => handleChange('y', yAxisMin)}
                className="btn btn-secondary text-xs py-2"
              >
                Bottom Edge
              </button>
              <button
                onClick={() => handleChange('y', yAxisMax)}
                className="btn btn-secondary text-xs py-2"
              >
                Top Edge
              </button>
            </div>
            <button
              onClick={() => {
                const midX = xAxisMin + (xAxisMax - xAxisMin) / 2;
                const midY = yAxisMin + (yAxisMax - yAxisMin) / 2;
                handleChange('x', midX);
                handleChange('y', midY);
              }}
              className="btn btn-primary text-xs py-2 w-full"
            >
              Center Bubble
            </button>
          </div>

          <div className="text-xs text-gray-400 pt-2 border-t border-gray-600">
            💡 <strong>Tip:</strong> All changes are saved automatically as you adjust the controls!
          </div>
        </div>
      </div>
    </div>
  );
}
