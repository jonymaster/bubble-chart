# Sample Data

This folder contains sample JSON files that you can use with the Bubble Chart application.

## How to use

1. **Import a sample file**: Use the "Import Data" button in the application to load any of the JSON files from this folder.

2. **Create your own**: You can create your own JSON files following the same structure as `sample_chart.json`.

## File Structure

Each JSON file should contain:

```json
{
  "title": "Your Chart Title",
  "bubbles": [
    {
      "id": "unique-id",
      "name": "Bubble Name",
      "x": 5,
      "y": 7,
      "size": 6,
      "group": "group-id"
    }
  ],
  "groups": [
    {
      "id": "group-id",
      "name": "Group Name",
      "color": "#3b82f6"
    }
  ],
  "xAxis": {
    "label": "X Axis Label",
    "min": 0,
    "max": 10
  },
  "yAxis": {
    "label": "Y Axis Label",
    "min": 0,
    "max": 10
  },
  "quadrants": {
    "topLeft": "Top Left Label",
    "topRight": "Top Right Label",
    "bottomLeft": "Bottom Left Label",
    "bottomRight": "Bottom Right Label",
    "colors": {
      "topLeft": "rgba(99, 102, 241, 0.08)",
      "topRight": "rgba(236, 72, 153, 0.08)",
      "bottomLeft": "rgba(34, 197, 94, 0.08)",
      "bottomRight": "rgba(245, 158, 11, 0.08)"
    }
  }
}
```

## Available Sample Files

- `sample_chart.json` - A project prioritization matrix with 8 sample projects across 3 teams
