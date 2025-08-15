# Bubble Chart Creator

A simple and beautiful bubble chart creator built with Next.js and D3.js. Create interactive bubble charts with multiple dimensions and group colors, all stored locally in your browser.

## Features

- **Interactive Bubble Charts**: Create beautiful bubble charts with D3.js
- **Multiple Dimensions**: Each bubble has X, Y, and size dimensions
- **Group Colors**: Organize bubbles into groups with different colors
- **Local Storage**: All data is stored locally in your browser
- **Real-time Updates**: See changes immediately as you edit
- **Responsive Design**: Works on desktop and mobile devices
- **Easy to Use**: Simple forms for adding and editing data

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd bubble-chart
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000`

## How to Use

### 1. Configure Your Chart
- Set up your X and Y axis labels and ranges
- The chart will automatically scale to your specified ranges

### 2. Create Groups
- Click "Add Group" to create color-coded groups
- Each group gets a unique color for easy identification
- Edit or delete groups as needed

### 3. Add Bubbles
- Click "Add Bubble" to create new data points
- Fill in the bubble name, X value, Y value, and size
- Assign each bubble to a group
- The bubble will appear on the chart with the group's color

### 4. Interact with Your Chart
- Hover over bubbles to see detailed information
- Edit or delete bubbles and groups
- All changes are automatically saved to your browser's local storage

## Data Structure

Each bubble has the following properties:
- **Name**: Display name for the bubble
- **X Value**: Position on the X-axis
- **Y Value**: Position on the Y-axis  
- **Size**: Determines the bubble's radius
- **Group**: Associates the bubble with a color group

## Technical Details

- **Framework**: Next.js 14 with TypeScript
- **Visualization**: D3.js for chart rendering
- **Storage**: Browser localStorage for data persistence
- **Styling**: Custom CSS with modern design
- **State Management**: React hooks for local state

## File Structure

```
bubble-chart/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── BubbleChart.tsx     # D3.js chart component
│   ├── BubbleForm.tsx      # Form for adding/editing bubbles
│   └── GroupForm.tsx       # Form for adding/editing groups
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   └── storage.ts          # Local storage utilities
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Customization

### Adding New Features
- The modular structure makes it easy to add new features
- Components are reusable and well-typed
- Storage utilities can be extended for different data types

### Styling
- Modify `app/globals.css` for custom styling
- The chart uses D3.js for rendering, so you can customize the visualization
- Color schemes can be changed in the group creation form

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript
- localStorage API
- CSS Grid and Flexbox

## Local Development

The application runs entirely locally:
- No external API calls
- No database required
- Data persists between browser sessions
- Perfect for offline use

## Troubleshooting

### Chart Not Displaying
- Make sure you have at least one bubble added
- Check that your axis ranges are properly set
- Verify that all bubbles have valid X, Y, and size values

### Data Not Saving
- Ensure your browser supports localStorage
- Check browser console for any JavaScript errors
- Try refreshing the page to reload data

### Performance Issues
- Large datasets (100+ bubbles) may affect performance
- Consider reducing the number of bubbles for better performance
- The chart automatically scales to handle different data ranges

## License

This project is open source and available under the MIT License.
