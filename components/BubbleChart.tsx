'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData, Bubble } from '../lib/types';

interface BubbleChartProps {
  data: ChartData;
  width?: number;
  height?: number;
  onBubbleClick?: (bubble: Bubble) => void;
  onBubbleDrag?: (bubbleId: string, x: number, y: number) => void;
  onFullScreen?: () => void;
  onExportImage?: () => void;
}

export default function BubbleChart({ 
  data, 
  width = 800, 
  height = 600, 
  onBubbleClick,
  onBubbleDrag,
  onFullScreen,
  onExportImage
}: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([data.xAxis.min, data.xAxis.max])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([data.yAxis.min, data.yAxis.max])
      .range([chartHeight, 0]);

    // Fix size scale to properly update when bubble sizes change
    const maxSize = d3.max(data.bubbles, d => d.size) || 100;
    const sizeScale = d3.scaleLinear()
      .domain([0, maxSize])
      .range([8, 60]);

    // Create color scale for groups
    const colorScale = d3.scaleOrdinal()
      .domain(data.groups.map(g => g.id))
      .range(data.groups.map(g => g.color));

    // Create chart group
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add quadrant backgrounds
    const quadrantWidth = chartWidth / 2;
    const quadrantHeight = chartHeight / 2;
    const midX = data.xAxis.min + (data.xAxis.max - data.xAxis.min) / 2;
    const midY = data.yAxis.min + (data.yAxis.max - data.yAxis.min) / 2;

    // Quadrant 1: Top Right (High X, High Y)
    chart.append('rect')
      .attr('x', xScale(midX))
      .attr('y', 0)
      .attr('width', quadrantWidth)
      .attr('height', quadrantHeight)
      .attr('fill', data.quadrants.colors.topRight);

    // Quadrant 2: Top Left (Low X, High Y)
    chart.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', quadrantWidth)
      .attr('height', quadrantHeight)
      .attr('fill', data.quadrants.colors.topLeft);

    // Quadrant 3: Bottom Left (Low X, Low Y)
    chart.append('rect')
      .attr('x', 0)
      .attr('y', quadrantHeight)
      .attr('width', quadrantWidth)
      .attr('height', quadrantHeight)
      .attr('fill', data.quadrants.colors.bottomLeft);

    // Quadrant 4: Bottom Right (High X, Low Y)
    chart.append('rect')
      .attr('x', xScale(midX))
      .attr('y', quadrantHeight)
      .attr('width', quadrantWidth)
      .attr('height', quadrantHeight)
      .attr('fill', data.quadrants.colors.bottomRight);

    // Add quadrant labels
    // Top left quadrant (Key Operations) - positioned at top edge
    chart.append('text')
      .attr('x', quadrantWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#e5e7eb')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
      .text(data.quadrants.topLeft);

    // Top right quadrant (Strategic Projects) - positioned at top edge
    chart.append('text')
      .attr('x', xScale(midX) + quadrantWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#e5e7eb')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
      .text(data.quadrants.topRight);

    // Bottom left quadrant (Daily Grind) - positioned at bottom edge
    chart.append('text')
      .attr('x', quadrantWidth / 2)
      .attr('y', chartHeight - 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#e5e7eb')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
      .text(data.quadrants.bottomLeft);

    // Bottom right quadrant (Specialized Tasks) - positioned at bottom edge
    chart.append('text')
      .attr('x', xScale(midX) + quadrantWidth / 2)
      .attr('y', chartHeight - 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#e5e7eb')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
      .text(data.quadrants.bottomRight);

    // Add X axis
    const xAxis = d3.axisBottom(xScale);
    chart.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis)
      .style('color', '#9ca3af');

    // Add X axis label
    chart.append('text')
      .attr('x', chartWidth / 2)
      .attr('y', chartHeight + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#9ca3af')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
      .text(data.xAxis.label);

    // Add Y axis
    const yAxis = d3.axisLeft(yScale);
    chart.append('g')
      .call(yAxis)
      .style('color', '#9ca3af');

    // Add Y axis label
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -chartHeight / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#9ca3af')
      .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
      .text(data.yAxis.label);

    // Group bubbles by their group
    const groupedBubbles = data.groups.map(group => ({
      group,
      bubbles: data.bubbles.filter(bubble => bubble.group === group.id)
    }));

    // Add bubbles for each group
    groupedBubbles.forEach((groupData, groupIndex) => {
      const bubbles = chart.selectAll(`.bubble-group-${groupIndex}`)
        .data(groupData.bubbles)
        .enter()
        .append('g')
        .attr('class', `bubble-group-${groupIndex}`);

      // Add bubble circles
      const circles = bubbles.append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => sizeScale(d.size))
        .attr('fill', d => {
          const group = data.groups.find(g => g.id === d.group);
          return group ? group.color : '#666';
        })
        .attr('opacity', 0.7)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this)
            .attr('opacity', 1)
            .attr('stroke-width', 3);
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('opacity', 0.7)
            .attr('stroke-width', 2);
        });

      // Track drag state
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let originalX = 0;
      let originalY = 0;
      let hasMoved = false;

      // Add drag behavior
      circles.call(d3.drag<SVGCircleElement, Bubble>()
        .on('start', function(event, d) {
          console.log('Drag start - Original position:', d.x, d.y);
          isDragging = false;
          hasMoved = false;
          startX = event.x;
          startY = event.y;
          originalX = d.x;
          originalY = d.y;
          d3.select(this).attr('opacity', 0.8);
        })
        .on('drag', function(event, d) {
          // Check if we've moved enough to consider this a drag
          const deltaX = Math.abs(event.x - startX);
          const deltaY = Math.abs(event.y - startY);
          
          if (deltaX > 5 || deltaY > 5) {
            if (!hasMoved) {
              console.log('Starting actual drag - hasMoved set to true');
              hasMoved = true;
              isDragging = true;
            }
          }
          
          // Only update position if we're actually dragging
          if (hasMoved && isDragging) {
            console.log('Updating position during drag');
            
            // Calculate the mouse movement delta in screen coordinates
            const deltaScreenX = event.x - startX;
            const deltaScreenY = event.y - startY;
            
            // Convert screen delta to data delta using scale ranges
            const xRange = data.xAxis.max - data.xAxis.min;
            const yRange = data.yAxis.max - data.yAxis.min;
            const deltaDataX = (deltaScreenX / chartWidth) * xRange;
            const deltaDataY = -(deltaScreenY / chartHeight) * yRange; // Negative because Y is inverted
            
            // Calculate new position by adding delta to original position
            const newX = originalX + deltaDataX;
            const newY = originalY + deltaDataY;
            
            // Clamp to axis bounds
            const finalX = Math.max(data.xAxis.min, Math.min(data.xAxis.max, newX));
            const finalY = Math.max(data.yAxis.min, Math.min(data.yAxis.max, newY));
            
            console.log('Delta screen:', deltaScreenX, deltaScreenY);
            console.log('Delta data:', deltaDataX, deltaDataY);
            console.log('Original:', originalX, originalY);
            console.log('New position:', finalX, finalY);
            
            // Update the circle position
            d3.select(this)
              .attr('cx', xScale(finalX))
              .attr('cy', yScale(finalY));
            
            // Update the label position
            d3.select(this.parentNode as Element)
              .select('text')
              .attr('x', xScale(finalX))
              .attr('y', yScale(finalY) + sizeScale(d.size) + 15);
          }
        })
        .on('end', function(event, d) {
          d3.select(this).attr('opacity', 0.7);
          
          if (hasMoved && isDragging) {
            // Calculate the final mouse movement delta
            const deltaScreenX = event.x - startX;
            const deltaScreenY = event.y - startY;
            
            // Convert screen delta to data delta
            const xRange = data.xAxis.max - data.xAxis.min;
            const yRange = data.yAxis.max - data.yAxis.min;
            const deltaDataX = (deltaScreenX / chartWidth) * xRange;
            const deltaDataY = -(deltaScreenY / chartHeight) * yRange;
            
            // Calculate final position
            const newX = originalX + deltaDataX;
            const newY = originalY + deltaDataY;
            
            // Clamp to axis bounds
            const finalX = Math.max(data.xAxis.min, Math.min(data.xAxis.max, newX));
            const finalY = Math.max(data.yAxis.min, Math.min(data.yAxis.max, newY));
            
            console.log('Drag end - Final position:', finalX, finalY);
            
            if (onBubbleDrag) {
              onBubbleDrag(d.id, finalX, finalY);
            }
          }
          
          // Reset drag state after a short delay
          setTimeout(() => {
            isDragging = false;
            hasMoved = false;
          }, 100);
        })
      );

      // Add click handler separately
      circles.on('click', function(event, d) {
        console.log('Click event triggered, isDragging:', isDragging);
        // Only trigger click if not dragging
        if (!isDragging && onBubbleClick) {
          console.log('Calling onBubbleClick');
          onBubbleClick(d);
        }
      });

      // Add bubble labels below the bubbles
      bubbles.append('text')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y) + sizeScale(d.size) + 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '400')
        .style('fill', '#9ca3af')
        .style('pointer-events', 'none')
        .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.6)')
        .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
        .text(d => d.name);
    });

  }, [data, width, height, onBubbleClick]);

  return (
    <div className="chart-container bg-gray-800 border border-gray-700 relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ display: 'block', margin: '0 auto' }}
      />
      
      {/* Legend moved outside the chart */}
      <div className="mt-4 flex justify-center gap-6">
        {data.groups.map(group => (
          <div key={group.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: group.color }}
            />
            <span className="text-sm font-medium text-gray-300">{group.name}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons - moved to bottom */}
      <div className="mt-4 flex justify-center gap-2">
        {onExportImage && (
          <button
            onClick={onExportImage}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm"
            title="Export as Image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Export</span>
          </button>
        )}
        
        {onFullScreen && (
          <button
            onClick={onFullScreen}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm"
            title="Full Screen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>Full Screen</span>
          </button>
        )}
      </div>
    </div>
  );
}
