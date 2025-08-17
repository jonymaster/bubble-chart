export const exportChartAsImage = (svgElement: SVGSVGElement, title: string, format: 'png' | 'jpeg' = 'png'): void => {
  // Get current theme from localStorage
  const currentTheme = localStorage.getItem('bubble-chart-theme') || 'dark';
  const isDark = currentTheme === 'dark';
  
  // Find the chart container instead of just the SVG
  let chartContainer = svgElement.closest('.chart-container') as HTMLElement;
  
  // If we can't find it with closest, try to find it in the parent hierarchy
  if (!chartContainer) {
    chartContainer = svgElement.parentElement?.closest('.chart-container') as HTMLElement;
  }
  
  // If still not found, try to find any chart container
  if (!chartContainer) {
    chartContainer = document.querySelector('.chart-container') as HTMLElement;
  }
  
  if (!chartContainer) {
    alert('Chart container not found. Please make sure the chart is properly rendered.');
    return;
  }

  // Use html2canvas for better export
  import('html2canvas').then((html2canvas) => {
    // Create a temporary export container
    const exportContainer = chartContainer.cloneNode(true) as HTMLElement;
    
    // Hide the action buttons in the export container
    const actionButtons = exportContainer.querySelector('.mt-4.flex.justify-center.gap-2') as HTMLElement;
    if (actionButtons) {
      actionButtons.style.display = 'none';
    }
    
    // Add the chart title at the top
    const titleElement = document.createElement('div');
    titleElement.textContent = title;
    titleElement.style.cssText = `
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 24px;
      font-weight: bold;
      color: ${isDark ? 'white' : 'black'};
      text-align: center;
      margin-bottom: 20px;
      padding: 0;
    `;
    
    // Insert title at the beginning of the container
    exportContainer.insertBefore(titleElement, exportContainer.firstChild);
    
    // Apply export-specific styles
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = 'auto';
    exportContainer.style.maxWidth = 'none';
    exportContainer.style.minWidth = 'auto';
    exportContainer.style.margin = '0';
    exportContainer.style.padding = '20px';
    exportContainer.style.backgroundColor = isDark ? 'rgb(33, 33, 33)' : 'rgb(255, 255, 255)';
    exportContainer.style.border = isDark ? '1px solid rgb(75, 85, 99)' : '1px solid rgb(203, 213, 225)';
    exportContainer.style.borderRadius = '8px';
    
    // Add to document temporarily
    document.body.appendChild(exportContainer);
    
    html2canvas.default(exportContainer, {
      backgroundColor: isDark ? 'rgb(15, 15, 15)' : 'rgb(248, 250, 252)', // theme-aware background
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure fonts and colors are applied to cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          svg text {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          .chart-container {
            background: ${isDark ? 'rgb(33, 33, 33)' : 'rgb(255, 255, 255)'} !important;
            border: 1px solid ${isDark ? 'rgb(75, 85, 99)' : 'rgb(203, 213, 225)'} !important;
          }
          body {
            background: ${isDark ? 'rgb(15, 15, 15)' : 'rgb(248, 250, 252)'} !important;
            color: ${isDark ? 'rgb(243, 244, 246)' : 'rgb(15, 23, 42)'} !important;
          }
          circle {
            filter: drop-shadow(2px 3px 3px ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}) !important;
            stroke: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'} !important;
            stroke-width: 1px !important;
          }
        `;
        clonedDoc.head.appendChild(style);
        
        // Also apply fonts directly to SVG text elements
        const clonedContainer = clonedDoc.querySelector('.chart-container') as HTMLElement;
        if (clonedContainer) {
          const svgTexts = clonedContainer.querySelectorAll('svg text');
          svgTexts.forEach((text) => {
            (text as SVGTextElement).style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
          });
        }
      }
    }).then((canvas) => {
      // Remove temporary container
      document.body.removeChild(exportContainer);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create download link
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${(title || 'chart').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
          URL.revokeObjectURL(downloadUrl);
        }
      }, `image/${format}`, 0.95);
    }).catch((error) => {
      // Remove temporary container on error
      if (document.body.contains(exportContainer)) {
        document.body.removeChild(exportContainer);
      }
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    });
  }).catch(() => {
    alert('Image export library not available. Please refresh the page and try again.');
  });
};

export const exportFullScreenChartAsImage = (chartContainer: HTMLElement, title: string, format: 'png' | 'jpeg' = 'png'): void => {
  // Get current theme from localStorage
  const currentTheme = localStorage.getItem('bubble-chart-theme') || 'dark';
  const isDark = currentTheme === 'dark';
  // Use html2canvas for full-screen export
  import('html2canvas').then((html2canvas) => {
    html2canvas.default(chartContainer, {
      backgroundColor: isDark ? 'rgb(15, 15, 15)' : 'rgb(248, 250, 252)', // theme-aware background
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      logging: false
    }).then((canvas) => {
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create download link
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${(title || 'chart').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
          URL.revokeObjectURL(downloadUrl);
        }
      }, `image/${format}`, 0.95);
    }).catch((error) => {
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    });
  }).catch(() => {
    alert('Image export library not available. Please refresh the page and try again.');
  });
};
