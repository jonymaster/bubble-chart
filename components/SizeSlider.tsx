'use client';

import { useState, useEffect } from 'react';
import { Bubble, ChartData } from '../lib/types';
import { updateBubble, loadChartData } from '../lib/storage';

interface SizeSliderProps {
  selectedBubble: Bubble | null;
  onUpdate: () => void;
  onClose: () => void;
}

export default function SizeSlider({ selectedBubble, onUpdate, onClose }: SizeSliderProps) {
  const [size, setSize] = useState(25);
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    setChartData(loadChartData());
  }, []);

  useEffect(() => {
    if (selectedBubble) {
      setSize(selectedBubble.size);
    }
  }, [selectedBubble]);

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    if (selectedBubble) {
      updateBubble(selectedBubble.id, { size: newSize });
      onUpdate();
    }
  };

  if (!selectedBubble || !chartData) return null;

  const group = chartData.groups.find(g => g.id === selectedBubble.group);
  const bubbleColor = group?.color || '#6b7280';

  return (
    <div className="chart-container bg-gray-700 border border-gray-600 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          Edit: {selectedBubble.name}
        </h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl font-bold"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="form-group">
          <label className="flex items-center justify-between">
            <span>Size: {size}</span>
            <span className="text-sm text-gray-400">
              {selectedBubble.x.toFixed(1)}, {selectedBubble.y.toFixed(1)}
            </span>
          </label>
          <input
            type="range"
            min="5"
            max="100"
            step="1"
            value={size}
            onChange={(e) => handleSizeChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-600">
          <div 
            className="rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-xs"
            style={{
              width: `${Math.max(20, size / 3)}px`,
              height: `${Math.max(20, size / 3)}px`,
              backgroundColor: bubbleColor
            }}
          >
            {selectedBubble.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-sm text-gray-300">
            <div><strong>Name:</strong> {selectedBubble.name}</div>
            <div><strong>Size:</strong> {size}</div>
            <div><strong>Position:</strong> ({selectedBubble.x.toFixed(1)}, {selectedBubble.y.toFixed(1)})</div>
            <div><strong>Group:</strong> {group?.name || 'Unknown'}</div>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          💡 <strong>Tip:</strong> You can also drag the bubble around the chart to change its position!
        </div>
      </div>
    </div>
  );
}
