'use client';

import { useState, useEffect } from 'react';
import { Bubble, Group, ChartData } from '../lib/types';
import { addBubble, updateBubble, loadChartData } from '../lib/storage';

interface BubbleFormProps {
  groups: Group[];
  onSave: () => void;
  bubbleToEdit?: Bubble;
  onCancel: () => void;
}

export default function BubbleForm({ groups, onSave, bubbleToEdit, onCancel }: BubbleFormProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    x: 12.5,
    y: 12.5,
    size: 25,
    group: groups[0]?.id || '',
  });

  useEffect(() => {
    setChartData(loadChartData());
  }, []);

  useEffect(() => {
    if (chartData) {
      const midX = chartData.xAxis.min + (chartData.xAxis.max - chartData.xAxis.min) / 2;
      const midY = chartData.yAxis.min + (chartData.yAxis.max - chartData.yAxis.min) / 2;
      
      if (bubbleToEdit) {
        setFormData({
          name: bubbleToEdit.name,
          x: bubbleToEdit.x,
          y: bubbleToEdit.y,
          size: bubbleToEdit.size,
          group: bubbleToEdit.group,
        });
      } else {
        setFormData(prev => ({
          ...prev,
          x: midX,
          y: midY,
        }));
      }
    }
  }, [bubbleToEdit, chartData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bubbleToEdit) {
      updateBubble(bubbleToEdit.id, formData);
    } else {
      addBubble(formData);
    }
    
    onSave();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'x' || name === 'y' || name === 'size' ? parseFloat(value) : value,
    }));
  };

  const handleSliderChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  if (!chartData) {
    return <div className="chart-container">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="chart-container fade-in">
      <h3 className="text-2xl font-bold text-white mb-6">
        {bubbleToEdit ? 'Edit Bubble' : 'Add New Bubble'}
      </h3>
      
      <div className="form-group">
        <label htmlFor="name">Bubble Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter bubble name..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="group">Group:</label>
        <select
          id="group"
          name="group"
          value={formData.group}
          onChange={handleChange}
          required
        >
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="x">
          {chartData.xAxis.label}: <span className="text-indigo-400 font-semibold">{formData.x.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="x"
          name="x"
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
        <label htmlFor="y">
          {chartData.yAxis.label}: <span className="text-indigo-400 font-semibold">{formData.y.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="y"
          name="y"
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

      <div className="form-group">
        <label htmlFor="size">
          Size: <span className="text-indigo-400 font-semibold">{formData.size.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="size"
          name="size"
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

      {/* Preview Section */}
      <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Preview:</h4>
        <div className="flex items-center gap-4">
          <div 
            className="rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-xs"
            style={{
              width: `${Math.max(20, formData.size / 3)}px`,
              height: `${Math.max(20, formData.size / 3)}px`,
              backgroundColor: groups.find(g => g.id === formData.group)?.color || '#6b7280'
            }}
          >
            {formData.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-sm text-gray-300">
            <div><strong>Name:</strong> {formData.name || 'Unnamed'}</div>
            <div><strong>Group:</strong> {groups.find(g => g.id === formData.group)?.name || 'None'}</div>
            <div><strong>Position:</strong> ({formData.x.toFixed(1)}, {formData.y.toFixed(1)})</div>
            <div><strong>Size:</strong> {formData.size.toFixed(1)}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="submit" className="btn btn-primary flex-1">
          {bubbleToEdit ? 'Update' : 'Add'} Bubble
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
