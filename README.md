
# Excel Row-to-Column Conversion Tool

A web-based tool that transforms data from wide format to long format by unpivoting selected columns. Perfect for preparing data for BI tools, dashboards, and analytics applications.

## 🌟 Features

- **File Upload**: Supports CSV files with automatic header detection
- **Flexible Column Selection**: Choose which columns to keep and which to pivot
- **Client-Side Processing**: All transformations happen in your browser - no data leaves your device
- **Excel Export**: Download results directly as Excel files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User-Friendly Interface**: Intuitive tabbed interface with built-in guide
- **Live Examples**: Includes sample data and transformation examples

## 🚀 Quick Start

### Option 1: Use Live Version
Visit the [live demo](https://soemoehtun.github.io/profolio/) to use the tool immediately.

### Option 2: Local Setup
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start converting your data!

## 📖 How to Use

### Step 1: Upload Your Data
- Click "Choose File" and select your CSV file
- Click "Import Data" to load the file
- The tool will display all available columns

### Step 2: Select Columns
- **Columns to Keep**: Select identifier columns (Site, Date, Country, etc.)
- **Columns to Pivot**: Select value columns (KPIs, metrics, etc.)
- Use the quick selection buttons for bulk operations

### Step 3: Configure Options
- Toggle "Include Pivot Column Name" to add a column with original field names
- This is useful for tracking which metric each value represents

### Step 4: Run Conversion
- Click "Run Conversion & Download"
- The tool will process your data and automatically download the Excel file

## 📊 Example Transformation

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
