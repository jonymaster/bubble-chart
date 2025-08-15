import { ChartData, Bubble, Group } from './types';

const STORAGE_KEY = 'bubble-chart-data';

// Sample data inspired by the IT responsibility matrix
const sampleData: ChartData = {
  title: 'IT Responsibility Matrix',
  bubbles: [
    // Helpdesk tasks
    { id: '1', name: 'Grant App Access', x: 3, y: 5, size: 6, group: 'helpdesk' },
    { id: '2', name: 'Laptop Support', x: 4, y: 6, size: 15, group: 'helpdesk' },
    { id: '3', name: 'Okta User Support', x: 3.5, y: 7, size: 12, group: 'helpdesk' },
    { id: '4', name: 'Jamf Operations', x: 5, y: 7, size: 18, group: 'helpdesk' },
    { id: '5', name: 'Network Troubleshooting', x: 16, y: 14, size: 36, group: 'helpdesk' },
    { id: '6', name: 'IT Documentation', x: 8, y: 16, size: 48, group: 'helpdesk' },
    { id: '7', name: 'Asset Management', x: 10, y: 16, size: 42, group: 'helpdesk' },
    { id: '8', name: 'Onboarding', x: 12, y: 17, size: 33, group: 'helpdesk' },
    { id: '9', name: 'Offboarding', x: 13, y: 20, size: 30, group: 'helpdesk' },
    
    // System Administrators tasks
    { id: '10', name: 'Okta Changes', x: 15, y: 13, size: 30, group: 'sysadmin' },
    { id: '11', name: 'Set up New SSO App', x: 17, y: 15, size: 39, group: 'sysadmin' },
    { id: '12', name: 'Jamf Policies', x: 14, y: 17, size: 36, group: 'sysadmin' },
    { id: '13', name: 'Core App Admin', x: 14, y: 18, size: 45, group: 'sysadmin' },
    { id: '14', name: 'Network Design', x: 18, y: 18, size: 48, group: 'sysadmin' },
    { id: '15', name: 'Automation Development', x: 17, y: 19, size: 54, group: 'sysadmin' },
    { id: '16', name: 'IT Strategy', x: 18, y: 20, size: 45, group: 'sysadmin' },
    { id: '17', name: 'System Migrations', x: 19, y: 20, size: 60, group: 'sysadmin' },
  ],
  groups: [
    { id: 'helpdesk', name: 'Helpdesk', color: '#38bdf8' },
    { id: 'sysadmin', name: 'System Administrators', color: '#f59e0b' },
  ],
  xAxis: { label: 'Complexity', min: 0, max: 25 },
  yAxis: { label: 'Business Impact', min: 0, max: 25 },
  quadrants: {
    topLeft: 'Key Operations',
    topRight: 'Strategic Projects',
    bottomLeft: 'Daily Grind',
    bottomRight: 'Specialized Tasks',
    colors: {
      topLeft: 'rgba(99, 102, 241, 0.08)',      // Indigo - modern, professional
      topRight: 'rgba(236, 72, 153, 0.08)',     // Pink - vibrant, energetic
      bottomLeft: 'rgba(34, 197, 94, 0.08)',    // Emerald - fresh, growth
      bottomRight: 'rgba(245, 158, 11, 0.08)'   // Amber - warm, attention
    }
  }
};

export const saveChartData = (data: ChartData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const loadChartData = (): ChartData => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      
      // Migrate existing data to include quadrant colors if missing
      if (!data.quadrants) {
        data.quadrants = {
          topLeft: 'Top Left',
          topRight: 'Top Right',
          bottomLeft: 'Bottom Left',
          bottomRight: 'Bottom Right',
          colors: {
            topLeft: 'rgba(99, 102, 241, 0.08)',      // Indigo - modern, professional
            topRight: 'rgba(236, 72, 153, 0.08)',     // Pink - vibrant, energetic
            bottomLeft: 'rgba(34, 197, 94, 0.08)',    // Emerald - fresh, growth
            bottomRight: 'rgba(245, 158, 11, 0.08)'   // Amber - warm, attention
          }
        };
      } else if (!data.quadrants.colors) {
        data.quadrants.colors = {
          topLeft: 'rgba(99, 102, 241, 0.08)',      // Indigo - modern, professional
          topRight: 'rgba(236, 72, 153, 0.08)',     // Pink - vibrant, energetic
          bottomLeft: 'rgba(34, 197, 94, 0.08)',    // Emerald - fresh, growth
          bottomRight: 'rgba(245, 158, 11, 0.08)'   // Amber - warm, attention
        };
      }
      
      // Save the migrated data
      saveChartData(data);
      return data;
    }
  }
  
  // Return sample data if no stored data exists
  return sampleData;
};

export const resetToSampleData = (): ChartData => {
  saveChartData(sampleData);
  return sampleData;
};

export const addBubble = (bubble: Omit<Bubble, 'id'>): Bubble => {
  const data = loadChartData();
  const newBubble: Bubble = {
    ...bubble,
    id: crypto.randomUUID(),
  };
  
  data.bubbles.push(newBubble);
  saveChartData(data);
  return newBubble;
};

export const updateBubble = (id: string, updates: Partial<Bubble>): void => {
  const data = loadChartData();
  const index = data.bubbles.findIndex(b => b.id === id);
  
  if (index !== -1) {
    data.bubbles[index] = { ...data.bubbles[index], ...updates };
    saveChartData(data);
  }
};

export const deleteBubble = (id: string): void => {
  const data = loadChartData();
  data.bubbles = data.bubbles.filter(b => b.id !== id);
  saveChartData(data);
};

export const addGroup = (group: Omit<Group, 'id'>): Group => {
  const data = loadChartData();
  const newGroup: Group = {
    ...group,
    id: crypto.randomUUID(),
  };
  
  data.groups.push(newGroup);
  saveChartData(data);
  return newGroup;
};

export const updateGroup = (id: string, updates: Partial<Group>): void => {
  const data = loadChartData();
  const index = data.groups.findIndex(g => g.id === id);
  
  if (index !== -1) {
    data.groups[index] = { ...data.groups[index], ...updates };
    saveChartData(data);
  }
};

export const deleteGroup = (id: string): void => {
  const data = loadChartData();
  data.groups = data.groups.filter(g => g.id !== id);
  // Remove bubbles that belong to this group
  data.bubbles = data.bubbles.filter(b => b.group !== id);
  saveChartData(data);
};

export const updateAxis = (axis: 'xAxis' | 'yAxis', updates: Partial<{ label: string; min: number; max: number }>): void => {
  const data = loadChartData();
  data[axis] = { ...data[axis], ...updates };
  saveChartData(data);
};

export const updateQuadrants = (updates: Partial<{ topLeft: string; topRight: string; bottomLeft: string; bottomRight: string }>): void => {
  const data = loadChartData();
  data.quadrants = { ...data.quadrants, ...updates };
  saveChartData(data);
};

export const updateQuadrantColors = (updates: Partial<{ topLeft: string; topRight: string; bottomLeft: string; bottomRight: string }>): void => {
  const data = loadChartData();
  data.quadrants.colors = { ...data.quadrants.colors, ...updates };
  saveChartData(data);
};

export const updateTitle = (title: string): void => {
  const data = loadChartData();
  data.title = title;
  saveChartData(data);
};

export const exportData = (): string => {
  const data = loadChartData();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): ChartData => {
  try {
    const data = JSON.parse(jsonData);
    saveChartData(data);
    return data;
  } catch (error) {
    console.error('Failed to import data:', error);
    throw new Error('Invalid data format');
  }
};

export const clearAllData = (): ChartData => {
  const emptyData: ChartData = {
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
        topLeft: 'rgba(99, 102, 241, 0.08)',      // Indigo - modern, professional
        topRight: 'rgba(236, 72, 153, 0.08)',     // Pink - vibrant, energetic
        bottomLeft: 'rgba(34, 197, 94, 0.08)',    // Emerald - fresh, growth
        bottomRight: 'rgba(245, 158, 11, 0.08)'   // Amber - warm, attention
      }
    }
  };
  saveChartData(emptyData);
  return emptyData;
};
