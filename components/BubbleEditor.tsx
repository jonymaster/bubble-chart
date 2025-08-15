'use client';

import { useState, useEffect } from 'react';
import { Bubble, ChartData, Group } from '../lib/types';
import { updateBubble, loadChartData } from '../lib/storage';

interface BubbleEditorProps {
  selectedBubble: Bubble | null;
  groups: Group[];
  onUpdate: () => void;
  onClose: () => void;
}

export default function BubbleEditor({ selectedBubble, groups, onUpdate, onClose }: BubbleEditorProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    x: 0,
    y: 0,
    size: 25,
    group: '',
  });

  useEffect(() => {
    setChartData(loadChartData());
  }, []);

  useEffect(() => {
    if (selectedBubble && chartData) {
      setFormData({
        name: selectedBubble.name,
        x: selectedBubble.x,
        y: selectedBubble.y,
        size: selectedBubble.size,
        group: selectedBubble.group,
      });
    }
  }, [selectedBubble, chartData]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (selectedBubble) {
      updateBubble(selectedBubble.id, { [field]: value });
      onUpdate();
    }
  };

  const handleSliderChange = (field: string, value: string) => {
    const numValue = parseFloat(value);
    handleChange(field, numValue);
  };

  if (!selectedBubble || !chartData) return null;

  const group = groups.find(g => g.id === selectedBubble.group);
  const bubbleColor = group?.color || '#6b7280';

  return (
    <div className="chart-container bg-gray-700 border border-gray-600 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          Edit Bubble: {selectedBubble.name}
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label>
              {chartData.xAxis.label}: <span className="text-indigo-400 font-semibold">{formData.x.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min={chartData.xAxis.min}
              max={chartData.xAxis.max}
              step="0.1"
              value={formData.x}
              onChange={(e) => handleSliderChange('x', e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{chartData.xAxis.min}</span>
              <span>{(chartData.xAxis.min + chartData.xAxis.max) / 2}</span>
              <span>{chartData.xAxis.max}</span>
            </div>
          </div>

          <div className="form-group">
            <label>
              {chartData.yAxis.label}: <span className="text-indigo-400 font-semibold">{formData.y.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min={chartData.yAxis.min}
              max={chartData.yAxis.max}
              step="0.1"
              value={formData.y}
              onChange={(e) => handleSliderChange('y', e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{chartData.yAxis.min}</span>
              <span>{(chartData.yAxis.min + chartData.yAxis.max) / 2}</span>
              <span>{chartData.yAxis.max}</span>
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
            onChange={(e) => handleSliderChange('size', e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Live Preview */}
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-600">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Live Preview:</h4>
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
              onClick={() => handleChange('x', chartData.xAxis.min)}
              className="btn btn-secondary text-xs py-2"
            >
              Left Edge
            </button>
            <button
              onClick={() => handleChange('x', chartData.xAxis.max)}
              className="btn btn-secondary text-xs py-2"
            >
              Right Edge
            </button>
            <button
              onClick={() => handleChange('y', chartData.yAxis.min)}
              className="btn btn-secondary text-xs py-2"
            >
              Bottom Edge
            </button>
            <button
              onClick={() => handleChange('y', chartData.yAxis.max)}
              className="btn btn-secondary text-xs py-2"
            >
              Top Edge
            </button>
          </div>
          <button
            onClick={() => {
              const midX = chartData.xAxis.min + (chartData.xAxis.max - chartData.xAxis.min) / 2;
              const midY = chartData.yAxis.min + (chartData.yAxis.max - chartData.yAxis.min) / 2;
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
  );
}
