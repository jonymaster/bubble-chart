'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartData, Bubble } from '../lib/types';
import { useTheme, themeColors } from '../lib/theme';

interface FullScreenChartProps {
  data: ChartData;
  onClose: () => void;
  onBubbleClick?: (bubble: Bubble) => void;
  onBubbleDrag?: (bubbleId: string, x: number, y: number) => void;
}

export default function FullScreenChart({
  data,
  onClose,
  onBubbleClick,
  onBubbleDrag
}: FullScreenChartProps) {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const svgRef = useRef<SVGSVGElement>(null);

  // Get screen dimensions
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const chartWidth = screenWidth - 100; // Leave some margin
  const chartHeight = screenHeight - 150; // Leave space for legend and close button

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = chartHeight - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([data.xAxis.min, data.xAxis.max])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([data.yAxis.min, data.yAxis.max])
      .range([innerHeight, 0]);

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

    // Add shadow filter definition
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'bubble-shadow-fullscreen')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feDropShadow')
      .attr('dx', '2')
      .attr('dy', '3')
      .attr('stdDeviation', '3')
      .attr('flood-color', colors.shadowColor);

    // Add quadrant backgrounds
    const quadrantWidth = innerWidth / 2;
    const quadrantHeight = innerHeight / 2;
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
      .style('fill', colors.textSecondary)
      .text(data.quadrants.topLeft);

    // Top right quadrant (Strategic Projects) - positioned at top edge
    chart.append('text')
      .attr('x', xScale(midX) + quadrantWidth / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', colors.textSecondary)
      .text(data.quadrants.topRight);

    // Bottom left quadrant (Daily Grind) - positioned at bottom edge
    chart.append('text')
      .attr('x', quadrantWidth / 2)
      .attr('y', innerHeight - 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', colors.textSecondary)
      .text(data.quadrants.bottomLeft);

    // Bottom right quadrant (Specialized Tasks) - positioned at bottom edge
    chart.append('text')
      .attr('x', xScale(midX) + quadrantWidth / 2)
      .attr('y', innerHeight - 20)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', colors.textSecondary)
      .text(data.quadrants.bottomRight);

    // Add X axis
    const xAxis = d3.axisBottom(xScale);
    chart.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .style('color', colors.textMuted);

    // Add X axis label
    chart.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', colors.textMuted)
      .text(data.xAxis.label);

    // Add Y axis
    const yAxis = d3.axisLeft(yScale);
    chart.append('g')
      .call(yAxis)
      .style('color', colors.textMuted);

    // Add Y axis label
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -innerHeight / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', colors.textMuted)
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
        .style('filter', 'url(#bubble-shadow-fullscreen)')
        .style('stroke', colors.strokeColor)
        .style('stroke-width', '1')
        .on('mouseover', function() {
          d3.select(this)
            .attr('opacity', 1)
            .attr('stroke-width', 2)
            .style('filter', 'url(#bubble-shadow-fullscreen) brightness(1.1)');
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('opacity', 0.7)
            .attr('stroke-width', 1)
            .style('filter', 'url(#bubble-shadow-fullscreen)');
        });

      // Add drag behavior if callbacks are provided
      if (onBubbleDrag) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let originalX = 0;
        let originalY = 0;
        let hasMoved = false;

        circles.call(d3.drag<SVGCircleElement, Bubble>()
          .on('start', function(event, d) {
            isDragging = false;
            hasMoved = false;
            startX = event.x;
            startY = event.y;
            originalX = d.x;
            originalY = d.y;
            d3.select(this)
              .attr('opacity', 0.8)
              .style('filter', 'url(#bubble-shadow-fullscreen) brightness(1.05)');
          })
          .on('drag', function(event, d) {
            const deltaX = Math.abs(event.x - startX);
            const deltaY = Math.abs(event.y - startY);
            
            if (deltaX > 5 || deltaY > 5) {
              if (!hasMoved) {
                hasMoved = true;
                isDragging = true;
              }
            }
            
            if (hasMoved && isDragging) {
              const deltaScreenX = event.x - startX;
              const deltaScreenY = event.y - startY;
              
              const xRange = data.xAxis.max - data.xAxis.min;
              const yRange = data.yAxis.max - data.yAxis.min;
              const deltaDataX = (deltaScreenX / innerWidth) * xRange;
              const deltaDataY = -(deltaScreenY / innerHeight) * yRange;
              
              const newX = originalX + deltaDataX;
              const newY = originalY + deltaDataY;
              
              const finalX = Math.max(data.xAxis.min, Math.min(data.xAxis.max, newX));
              const finalY = Math.max(data.yAxis.min, Math.min(data.yAxis.max, newY));
              
              d3.select(this)
                .attr('cx', xScale(finalX))
                .attr('cy', yScale(finalY));
              
              d3.select(this.parentNode as Element)
                .select('text')
                .attr('x', xScale(finalX))
                .attr('y', yScale(finalY) + sizeScale(d.size) + 15);
            }
          })
          .on('end', function(event, d) {
            d3.select(this)
              .attr('opacity', 0.7)
              .style('filter', 'url(#bubble-shadow-fullscreen)');
            
            if (hasMoved && isDragging) {
              const deltaScreenX = event.x - startX;
              const deltaScreenY = event.y - startY;
              
              const xRange = data.xAxis.max - data.xAxis.min;
              const yRange = data.yAxis.max - data.yAxis.min;
              const deltaDataX = (deltaScreenX / innerWidth) * xRange;
              const deltaDataY = -(deltaScreenY / innerHeight) * yRange;
              
              const newX = originalX + deltaDataX;
              const newY = originalY + deltaDataY;
              
              const finalX = Math.max(data.xAxis.min, Math.min(data.xAxis.max, newX));
              const finalY = Math.max(data.yAxis.min, Math.min(data.yAxis.max, newY));
              
              onBubbleDrag(d.id, finalX, finalY);
            }
            
            setTimeout(() => {
              isDragging = false;
              hasMoved = false;
            }, 100);
          })
        );
      }

      // Add click handler if callback is provided
      if (onBubbleClick) {
        circles.on('click', function(event, d) {
          onBubbleClick(d);
        });
      }

      // Add bubble labels below the bubbles
      bubbles.append('text')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y) + sizeScale(d.size) + 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', '400')
        .style('fill', colors.textMuted)
        .style('pointer-events', 'none')
        .style('text-shadow', theme === 'dark' ? '1px 1px 2px rgba(0,0,0,0.6)' : 'none')
        .text(d => d.name);
    });

  }, [data, chartWidth, chartHeight, onBubbleClick, onBubbleDrag]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{
      backgroundColor: `rgba(0, 0, 0, 0.9)`
    }}>
      <div className="rounded-lg border max-w-full max-h-full overflow-auto" style={{
        backgroundColor: colors.tileBackground,
        borderColor: colors.border
      }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold" style={{ color: colors.text }}>
              {data.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Find the current fullscreen chart container
                  const chartContainer = document.querySelector('.fixed.inset-0 .rounded-lg.border') as HTMLElement;
                  if (chartContainer) {
                    import('../lib/imageExport').then(({ exportFullScreenChartAsImage }) => {
                      exportFullScreenChartAsImage(chartContainer, data.title);
                    });
                  } else {
                    alert('Chart container not found for export.');
                  }
                }}
                className="px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 hover:opacity-80"
                style={{
                  backgroundColor: colors.border,
                  color: colors.text
                }}
                title="Export as Image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Export</span>
              </button>
              <button 
                onClick={onClose}
                className="text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity duration-200"
                style={{
                  color: colors.textSecondary
                }}
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg" style={{
            backgroundColor: colors.tileBackground,
            borderColor: colors.border
          }}>
            <svg
              ref={svgRef}
              width={chartWidth}
              height={chartHeight}
              style={{ display: 'block', margin: '0 auto' }}
            />
            
            {/* Legend */}
            <div className="p-4 flex justify-center gap-6">
              {data.groups.map(group => (
                <div key={group.id} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ 
                      backgroundColor: group.color
                    }}
                  />
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>{group.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm" style={{ color: colors.textMuted }}>
            💡 Press F11 for true full-screen mode, or use your browser's screenshot tool
          </div>
        </div>
      </div>
    </div>
  );
}
