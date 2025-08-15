export interface Bubble {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  group: string;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}

export interface Axis {
  label: string;
  min: number;
  max: number;
}

export interface ChartData {
  title: string;
  bubbles: Bubble[];
  groups: Group[];
  xAxis: Axis;
  yAxis: Axis;
  quadrants: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    colors: {
      topLeft: string;
      topRight: string;
      bottomLeft: string;
      bottomRight: string;
    };
  };
}
