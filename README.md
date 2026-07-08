
# Excel Row-to-Column Conversion Tool

A web-based tool that transforms data from wide format to long format by unpivoting selected columns. Perfect for preparing data for BI tools, dashboards, and analytics applications.

## Features

- **File Upload**: Supports CSV, TXT, XLSX, and XLSB files with automatic header detection and sheet selection
- **Drag & Drop**: Drag files directly into the upload zone
- **Flexible Column Selection**: Choose which columns to keep and which to pivot using multi-select lists
- **Client-Side Processing**: All transformations happen in your browser — no data leaves your device
- **CSV Export**: Download results directly as CSV files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Sample Data**: Includes a ready-to-use sample Excel file (`sample-data.xlsx`)

## Quick Start

### Option 1: Use Live Version
Visit the [live demo](https://soemoehtun.github.io/profolio/) to use the tool immediately.

### Option 2: Local Setup
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start converting your data!

## How to Use

### Step 1: Upload Your Data
- Click the upload area or drag & drop a CSV, TXT, or Excel file
- For Excel files, select the desired sheet from the dropdown
- The tool automatically loads and displays all available columns

### Step 2: Select Columns
- **Columns to Keep**: Select identifier columns (Site, Date, Country, etc.)
- **Columns to Pivot**: Select value columns (KPIs, metrics, etc.)
- Use the "Select All" checkbox for bulk operations

### Step 3: Configure Options
- Toggle **"Include Pivot Column Name"** to add a column with original field names
- This is useful for tracking which metric each value represents

### Step 4: Run Conversion
- Click **"Run Conversion & Download"**
- The tool processes your data and automatically downloads the CSV file

## Example Transformation

**Input (Wide Format):**
```
Site,Date,KPI1,KPI2
A,2025-01-01,10,20
A,2025-01-02,15,25
B,2025-01-01,5,8
```

**Output (Long Format):**
```
Site,Date,KPI Name,KPI Value
A,2025-01-01,KPI1,10
A,2025-01-01,KPI2,20
A,2025-01-02,KPI1,15
A,2025-01-02,KPI2,25
B,2025-01-01,KPI1,5
B,2025-01-01,KPI2,8
```

## Technical Details

### Dependencies
- **Tailwind CSS**: For utility-first styling (loaded via CDN)
- **Papa Parse**: For CSV parsing (loaded via CDN)
- **SheetJS (xlsx)**: For Excel file reading and CSV generation (loaded via CDN)

### Design System
The UI follows a light theme inspired by the **Octo Code** design system, featuring:
- Clean typography with Inter (UI) and JetBrains Mono (code)
- GitHub-style color palette with blue primary accents
- 6px border radius on all interactive elements

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Requirements
- **Input**: CSV, TXT, XLSX, XLSB files with a header row
- **Output**: CSV files
- **Max Size**: Limited by browser memory (typically works well with files up to 10MB)

## Use Cases

This tool is ideal when you need to:
- Prepare data for Power BI, Tableau, or other BI tools
- Convert survey results from wide to long format
- Transform time-series KPI data for analysis
- Normalize data for database imports
- Create flexible datasets for dashboarding

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: This tool processes all data locally in your browser. No data is transmitted to any server, ensuring your information remains private and secure.
