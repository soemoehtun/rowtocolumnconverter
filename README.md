# Excel Row-to-Column Conversion Tool

A web-based tool that transforms data from wide format to long format by unpivoting selected columns. Perfect for preparing data for BI tools, dashboards, and analytics applications.

> React + Vite + Tailwind CSS port of [soemoehtun/rowtocolumnconverter](https://github.com/soemoehtun/rowtocolumnconverter), restyled after [soemoehtun/RF-Power](https://github.com/soemoehtun/RF-Power) with a navy header card, Conversion Tool / User Guide tabs, and a compact mobile-first layout.

## Features

- **File Upload**: Supports CSV, TXT, XLSX, and XLSB files with automatic header detection and sheet selection
- **Drag & Drop**: Drag files directly into the upload zone
- **Sheet Selection**: Separate "Select Sheet" dropdown for multi-sheet Excel workbooks (outside the file box)
- **Flexible Column Selection**: Choose which columns to keep and which to pivot using checkbox lists with "Select All"
- **Include Pivot Column Name**: Toggle to add a column with original field names (e.g. KPI1, KPI2)
- **Client-Side Processing**: All transformations happen in your browser — no data leaves your device
- **CSV Export**: Click Run Conversion to unpivot and automatically download the result as CSV
- **Responsive Design**: Works seamlessly on desktop and mobile devices (full-bleed navy header on phones, compact 620px card on desktop)
- **Sample Data**: Built-in sample datasets to try the tool instantly without a file
- **User Guide Tab**: Numbered how-to steps plus a side-by-side Input (Wide) → Output (Long) example transformation

## Quick Start

### Option 1: Use Live Version

Visit the [live demo](https://soemoehtun.github.io/profolio/) to use the tool immediately.

### Option 2: Local Development (this repo)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Option 3: Production Build

```bash
npm run build
```

Output: `dist/index.html` (single inlined file via `vite-plugin-singlefile`). Open it directly in any browser, host it statically, or share it for offline use.

```bash
npm run preview
```

## How to Use

### Step 1: Upload Your Data

- Click the upload area or drag & drop a CSV, TXT, or Excel file
- For multi-sheet Excel files, pick the desired worksheet from the separate **Select Sheet** dropdown
- The tool automatically loads and displays all available columns

### Step 2: Select Columns

- **Columns to Keep**: Select identifier columns (Site, Date, Country, etc.)
- **Columns to Pivot**: Select value columns (KPIs, metrics, etc.)
- Use the **Select All** checkbox for bulk operations

### Step 3: Configure Options

- Toggle **"Include Pivot Column Name"** to add a column with original field names
- This is useful for tracking which metric each value represents

### Step 4: Run Conversion

- Click **"Run Conversion"**
- The tool processes your data and automatically downloads the CSV file (`<filename>-unpivoted.csv`)
- Use **Clear All** to reset the file, columns, and options

## Example Transformation

**Input (Wide Format):**

```csv
Site,Date,KPI1,KPI2
A,2025-01-01,10,20
A,2025-01-02,15,25
B,2025-01-01,5,8
```

**Output (Long Format):**

```csv
Site,Date,KPI Name,KPI Value
A,2025-01-01,KPI1,10
A,2025-01-01,KPI2,20
A,2025-01-02,KPI1,15
A,2025-01-02,KPI2,25
B,2025-01-01,KPI1,5
B,2025-01-01,KPI2,8
```

Formula: **Output rows = Input rows × Pivot columns** (3 rows × 2 KPIs = 6 rows).

## Technical Details

### Tech Stack

| Layer        | Technology                | Notes                                                        |
| ------------ | ------------------------- | ------------------------------------------------------------ |
| UI Framework | **React 19 + TypeScript** | Tabbed shell (Conversion Tool / User Guide)                  |
| Build Tool   | **Vite 7**                | Fast dev server and production bundling                      |
| Styling      | **Tailwind CSS v4**       | Class-based theming, mobile-first compact layout             |
| File Parsing | **xlsx (SheetJS)**        | Excel parsing running entirely in the browser                |
| CSV Parsing  | **Papa Parse**            | CSV / TXT parsing with header detection                      |
| Bundling     | **vite-plugin-singlefile**| Produces a single inlined `dist/index.html` for distribution |

No backend, no database, no telemetry — the entire app runs in the browser.

### Project Structure

```text
├── src/
│   ├── App.tsx                    # Tabbed shell (Conversion Tool / User Guide)
│   ├── main.tsx                   # React root mount
│   ├── index.css                  # Tailwind v4 entry + navy/gray page background
│   ├── types.ts                   # Shared types (ParsedFile, ConversionConfig, ...)
│   ├── data/samples.ts            # Built-in sample datasets
│   ├── utils/converter.ts         # File parsing, unpivot logic, CSV export
│   └── components/
│       ├── FileUploader.tsx       # Import dropzone + loaded file bar + sheet dropdown
│       ├── ColumnSelector.tsx     # Columns to Keep / Pivot checkbox boxes
│       ├── ConversionControls.tsx # Clear All / Run Conversion + status messages
│       └── GuideTab.tsx           # How-to-use steps + example transformation
├── index.html
├── package.json
├── vite.config.ts
└── README.md                      # ← you are here
```

### Design System

The UI follows the **RF-Power** reference style:

- Navy header (`#0f2744` / `#0b2542`) with tab ribbon and white underline on the active tab
- Light gray canvas (`#e8ecf1` desktop, navy overscroll/status-bar on phones)
- Compact centered white card (`620px`, rounded, subtle shadow; full-bleed on mobile)
- Sky-blue accents (`#0284c7`) for links, dropzone hover, and focus rings
- Emerald **Run Conversion** button with gradient + shadow
- Bright-blue checkboxes, mint/blue tinted example tables in the User Guide

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

This project is open source and available under the [MIT License](https://github.com/soemoehtun/rowtocolumnconverter/blob/main/LICENSE).

---

**Note**: This tool processes all data locally in your browser. No data is transmitted to any server, ensuring your information remains private and secure.
