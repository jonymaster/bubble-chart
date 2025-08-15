'use client';

import { useState, useEffect } from 'react';
import { ChartData, Bubble, Group } from '../lib/types';
import { loadChartData, deleteBubble, deleteGroup, updateAxis, resetToSampleData, exportData, importData, clearAllData, updateBubble, updateQuadrants, updateTitle, updateQuadrantColors, saveChartData } from '../lib/storage';
import { exportChartAsImage, exportFullScreenChartAsImage } from '../lib/imageExport';
import BubbleChart from '../components/BubbleChart';
import BubbleForm from '../components/BubbleForm';
import GroupForm from '../components/GroupForm';
import SimpleBubbleEditor from '../components/SimpleBubbleEditor';
import FullScreenChart from '../components/FullScreenChart';

export default function Home() {
  const [chartData, setChartData] = useState<ChartData>({
    title: 'Bubble Chart',
    bubbles: [],
    groups: [],
    xAxis: { label: 'X Axis', min: 0, max: 100 },
    yAxis: { label: 'Y Axis', min: 0, max: 100 },
    quadrants: {
      topLeft: 'Top Left',
      topRight: 'Top Right',
      bottomLeft: 'Bottom Left',
      bottomRight: 'Bottom Right',
      colors: {
        topLeft: 'rgba(16, 185, 129, 0.1)',
        topRight: 'rgba(59, 130, 246, 0.1)',
        bottomLeft: 'rgba(245, 158, 11, 0.1)',
        bottomRight: 'rgba(239, 68, 68, 0.1)'
      }
    }
  });
  
  const [showBubbleForm, setShowBubbleForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [bubbleToEdit, setBubbleToEdit] = useState<Bubble | undefined>();
  const [groupToEdit, setGroupToEdit] = useState<Group | undefined>();
  const [editingBubble, setEditingBubble] = useState<Bubble | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setChartData(loadChartData());
  }, []);

  const refreshData = () => {
    setChartData(loadChartData());
  };

  const handleBubbleUpdate = () => {
    // Force a fresh reload of the data to ensure chart updates
    const freshData = loadChartData();
    setChartData({ ...freshData }); // Create new object reference to trigger re-render
  };

  const handleBubbleClick = (bubble: Bubble) => {
    console.log('Bubble clicked:', bubble);
    setEditingBubble(bubble);
  };

  const handleBubbleDrag = (bubbleId: string, x: number, y: number) => {
    // Update the bubble position in storage
    updateBubble(bubbleId, { x, y });
    
    // Update the chart data directly to avoid full re-render
    setChartData(prevData => ({
      ...prevData,
      bubbles: prevData.bubbles.map(bubble => 
        bubble.id === bubbleId 
          ? { ...bubble, x, y }
          : bubble
      )
    }));

    // Update the modal if it's open for this bubble
    if (editingBubble && editingBubble.id === bubbleId) {
      setEditingBubble(prev => prev ? { ...prev, x, y } : null);
    }
  };

  const handleEditBubble = (bubble: Bubble) => {
    setBubbleToEdit(bubble);
    setShowBubbleForm(true);
  };

  const handleEditGroup = (group: Group) => {
    setGroupToEdit(group);
    setShowGroupForm(true);
  };

  const handleDeleteBubble = (id: string) => {
    if (confirm('Are you sure you want to delete this bubble?')) {
      deleteBubble(id);
      refreshData();
      if (editingBubble && editingBubble.id === id) {
        setEditingBubble(null);
      }
    }
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('Are you sure you want to delete this group? This will also delete all bubbles in this group.')) {
      deleteGroup(id);
      refreshData();
      if (editingBubble && editingBubble.group === id) {
        setEditingBubble(null);
      }
    }
  };

  const handleAxisChange = (axis: 'xAxis' | 'yAxis', field: string, value: string | number) => {
    updateAxis(axis, { [field]: value });
    refreshData();
  };

  const handleQuadrantChange = (quadrant: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', value: string) => {
    updateQuadrants({ [quadrant]: value });
    refreshData();
  };

  const handleQuadrantColorChange = (quadrant: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', value: string) => {
    updateQuadrantColors({ [quadrant]: value });
    refreshData();
  };

  const handleTitleChange = (title: string) => {
    updateTitle(title);
    refreshData();
  };

  const handleExportImage = () => {
    const svgElement = document.querySelector('svg') as SVGSVGElement;
    if (svgElement) {
      exportChartAsImage(svgElement, chartData.title);
    }
  };

  const handleExportFullScreenImage = () => {
    const chartContainer = document.querySelector('.bg-gray-900.rounded-lg.border.border-gray-600') as HTMLElement;
    if (chartContainer) {
      exportFullScreenChartAsImage(chartContainer, chartData.title);
    }
  };



  const handleLoadSampleData = async () => {
    try {
      const response = await fetch('/sample_data/sample_chart.json');
      if (!response.ok) {
        throw new Error('Failed to load sample data');
      }
      const sampleData = await response.json();
      setChartData(sampleData);
      saveChartData(sampleData);
      setEditingBubble(null);
      alert('Sample data loaded successfully!');
    } catch (error) {
      console.error('Error loading sample data:', error);
      alert('Failed to load sample data. Please check if the file exists in the sample_data folder.');
    }
  };

  const handleExportData = () => {
    const dataStr = exportData();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bubble-chart-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = importData(e.target?.result as string);
          setChartData(data);
          setEditingBubble(null);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm('This will clear all data. Are you sure?')) {
      setChartData(clearAllData());
      setEditingBubble(null);
    }
  };

  const handleCloseEditor = () => {
    setEditingBubble(null);
    refreshData(); // Ensure chart data is refreshed
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Interactive Bubble Chart Creator
          </h1>
          <p className="text-lg text-gray-400">
            Create beautiful bubble charts with multiple dimensions and group colors. Click bubbles to edit!
          </p>
        </header>

        {/* Data Management Bar */}
        <div className="chart-container mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setBubbleToEdit(undefined);
                  setShowBubbleForm(true);
                }}
              >
                Add Bubble
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setGroupToEdit(undefined);
                  setShowGroupForm(true);
                }}
              >
                Add Group
              </button>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-secondary" onClick={handleLoadSampleData}>
                Load Sample Data
              </button>
              <button className="btn btn-secondary" onClick={handleExportData}>
                Export Data
              </button>
              <label className="btn btn-secondary cursor-pointer">
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
              <button className="btn btn-danger" onClick={handleClearData}>
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Chart Configuration */}
        <div className="chart-container mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Chart Configuration</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-3">X Axis</h4>
              <div className="form-group">
                <label>Label:</label>
                <input
                  type="text"
                  value={chartData.xAxis.label}
                  onChange={(e) => handleAxisChange('xAxis', 'label', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Min Value:</label>
                  <input
                    type="number"
                    value={chartData.xAxis.min}
                    onChange={(e) => handleAxisChange('xAxis', 'min', parseFloat(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Max Value:</label>
                  <input
                    type="number"
                    value={chartData.xAxis.max}
                    onChange={(e) => handleAxisChange('xAxis', 'max', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Y Axis</h4>
              <div className="form-group">
                <label>Label:</label>
                <input
                  type="text"
                  value={chartData.yAxis.label}
                  onChange={(e) => handleAxisChange('yAxis', 'label', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label>Min Value:</label>
                  <input
                    type="number"
                    value={chartData.yAxis.min}
                    onChange={(e) => handleAxisChange('yAxis', 'min', parseFloat(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label>Max Value:</label>
                  <input
                    type="number"
                    value={chartData.yAxis.max}
                    onChange={(e) => handleAxisChange('yAxis', 'max', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quadrant Labels Configuration */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-300 mb-3">Quadrant Labels</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>Top Left:</label>
                <input
                  type="text"
                  value={chartData.quadrants.topLeft}
                  onChange={(e) => handleQuadrantChange('topLeft', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Top Right:</label>
                <input
                  type="text"
                  value={chartData.quadrants.topRight}
                  onChange={(e) => handleQuadrantChange('topRight', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Bottom Left:</label>
                <input
                  type="text"
                  value={chartData.quadrants.bottomLeft}
                  onChange={(e) => handleQuadrantChange('bottomLeft', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Bottom Right:</label>
                <input
                  type="text"
                  value={chartData.quadrants.bottomRight}
                  onChange={(e) => handleQuadrantChange('bottomRight', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Quadrant Colors Configuration */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-300 mb-3">Quadrant Colors (RGBA format)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label>Top Left:</label>
                <input
                  type="text"
                  value={chartData.quadrants.colors.topLeft}
                  onChange={(e) => handleQuadrantColorChange('topLeft', e.target.value)}
                  placeholder="rgba(16, 185, 129, 0.1)"
                />
              </div>
              <div className="form-group">
                <label>Top Right:</label>
                <input
                  type="text"
                  value={chartData.quadrants.colors.topRight}
                  onChange={(e) => handleQuadrantColorChange('topRight', e.target.value)}
                  placeholder="rgba(59, 130, 246, 0.1)"
                />
              </div>
              <div className="form-group">
                <label>Bottom Left:</label>
                <input
                  type="text"
                  value={chartData.quadrants.colors.bottomLeft}
                  onChange={(e) => handleQuadrantColorChange('bottomLeft', e.target.value)}
                  placeholder="rgba(245, 158, 11, 0.1)"
                />
              </div>
              <div className="form-group">
                <label>Bottom Right:</label>
                <input
                  type="text"
                  value={chartData.quadrants.colors.bottomRight}
                  onChange={(e) => handleQuadrantColorChange('bottomRight', e.target.value)}
                  placeholder="rgba(239, 68, 68, 0.1)"
                />
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              💡 Use RGBA format like "rgba(255, 0, 0, 0.1)" where the last number is opacity (0.0 to 1.0)
            </div>
          </div>

          {/* Chart Title Configuration */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-300 mb-3">Chart Title</h4>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={chartData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Forms */}
        {showBubbleForm && (
          <BubbleForm
            groups={chartData.groups}
            onSave={() => {
              refreshData();
              setShowBubbleForm(false);
              setBubbleToEdit(undefined);
            }}
            bubbleToEdit={bubbleToEdit}
            onCancel={() => {
              setShowBubbleForm(false);
              setBubbleToEdit(undefined);
            }}
          />
        )}

        {showGroupForm && (
          <GroupForm
            onSave={() => {
              refreshData();
              setShowGroupForm(false);
              setGroupToEdit(undefined);
            }}
            groupToEdit={groupToEdit}
            onCancel={() => {
              setShowGroupForm(false);
              setGroupToEdit(undefined);
            }}
          />
        )}

        {/* Simple Bubble Editor Modal */}
        {editingBubble && (
          <SimpleBubbleEditor
            bubble={editingBubble}
            groups={chartData.groups}
            xAxisLabel={chartData.xAxis.label}
            yAxisLabel={chartData.yAxis.label}
            xAxisMin={chartData.xAxis.min}
            xAxisMax={chartData.xAxis.max}
            yAxisMin={chartData.yAxis.min}
            yAxisMax={chartData.yAxis.max}
            onUpdate={handleBubbleUpdate}
            onCancel={handleCloseEditor}
          />
        )}

        {/* Bubble Chart */}
        {chartData.bubbles.length > 0 && (
          <BubbleChart 
            data={chartData} 
            width={1000} 
            height={700}
            onBubbleClick={handleBubbleClick}
            onBubbleDrag={handleBubbleDrag}
            onFullScreen={toggleFullScreen}
            onExportImage={handleExportImage}
          />
        )}

        {/* Full Screen Chart */}
        {isFullScreen && (
          <FullScreenChart
            data={chartData}
            onClose={toggleFullScreen}
            onBubbleClick={handleBubbleClick}
            onBubbleDrag={handleBubbleDrag}
          />
        )}

        {/* Data Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Groups List */}
          <div className="chart-container">
            <h3 className="text-xl font-bold text-white mb-4">
              Groups ({chartData.groups.length})
            </h3>
            {chartData.groups.map(group => (
              <div key={group.id} className="bubble-item slide-in">
                <div className="bubble-info">
                  <span 
                    className="color-preview" 
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="font-medium">{group.name}</span>
                </div>
                <div className="bubble-actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEditGroup(group)}
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDeleteGroup(group.id)}
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bubbles List */}
          <div className="chart-container">
            <h3 className="text-xl font-bold text-white mb-4">
              Bubbles ({chartData.bubbles.length})
            </h3>
            {chartData.bubbles.map(bubble => {
              const group = chartData.groups.find(g => g.id === bubble.group);
              return (
                <div key={bubble.id} className="bubble-item slide-in">
                  <div className="bubble-info">
                    <div className="font-medium text-white">{bubble.name}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {chartData.xAxis.label}: {bubble.x}, {chartData.yAxis.label}: {bubble.y}, Size: {bubble.size}
                    </div>
                    <div className="text-sm mt-1" style={{ color: group?.color }}>
                      Group: {group?.name || 'Unknown'}
                    </div>
                  </div>
                  <div className="bubble-actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEditBubble(bubble)}
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDeleteBubble(bubble.id)}
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {chartData.bubbles.length === 0 && (
          <div className="chart-container text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-4">No Bubbles Yet</h3>
            <p className="text-gray-400 mb-6">Start by adding some groups and bubbles to create your chart!</p>
            <div className="flex gap-4 justify-center">
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setGroupToEdit(undefined);
                  setShowGroupForm(true);
                }}
              >
                Add Your First Group
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleLoadSampleData}
              >
                Load Sample Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
