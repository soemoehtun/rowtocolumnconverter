# Row-to-Column Conversion Tool

A web-based tool that transforms data from **wide format** to **long format** by unpivoting selected columns. Perfect for preparing data for BI tools, dashboards, and analytics applications.

Everything runs **entirely in your browser** — no data is ever uploaded to a server.

---

## Features

- **File Upload** — Supports CSV, TXT, XLSX, and XLSB files with automatic header detection
- **Drag & Drop** — Drag files directly into the upload zone
- **Sheet Selection** — Multi-sheet workbooks show a dedicated *Select Sheet* dropdown
- **Flexible Column Selection** — Choose which columns to keep and which to pivot, with Select All for bulk operations
- **Include Pivot Column Name** — Optionally add a column containing the original field names
- **Client-Side Processing** — All transformations happen in your browser; no data leaves your device
- **CSV Export** — Download results directly as a CSV file
- **Responsive Design** — Full-bleed layout on mobile, centered card on desktop
- **User Guide Tab** — Built-in step-by-step instructions and a visual example transformation

---

## Quick Start

### Prerequisites

- **Node.js 18+** and `npm`

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open the URL printed in your terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
```

Output is written to `dist/index.html` as a single self-contained file.

### Preview the Build

```bash
npm run preview
```

---

## How to Use

### Step 1: Import Your Data

- Click the upload area or drag & drop a CSV, TXT, or Excel file
- For multi-sheet Excel files, pick the worksheet from the **Select Sheet** dropdown
- The tool automatically loads and displays all available columns
- Click the **×** icon to remove the current file

### Step 2: Select Columns

- **Columns to Keep** — Select identifier columns (Site, Date, Country, etc.)
- **Columns to Pivot** — Select value columns (KPIs, metrics, etc.)
- Use the **Select All** checkbox for bulk operations

### Step 3: Configure Options

- Toggle **Include Pivot Column Name** to add a column with the original field names
- Useful for tracking which metric each value represents

### Step 4: Run Conversion

- Click **Run Conversion**
- The tool processes your data and automatically downloads the CSV file

---

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

Output rows = input rows × pivoted columns (3 rows × 2 KPIs = 6 rows).

---

## Technical Details

### Tech Stack

| Layer        | Technology                 | Notes                                          |
| ------------ | -------------------------- | ---------------------------------------------- |
| UI Framework | **React + TypeScript**     | Component-based single-page app                |
| Build Tool   | **Vite**                   | Fast dev server and production bundling        |
| Styling      | **Tailwind CSS**           | Utility-first, no external CSS frameworks      |
| File Parsing | **xlsx (SheetJS)**         | CSV / XLSX / XLSB / TXT parsing in the browser |
| CSV Parsing  | **Papa Parse**             | Robust delimited-text parsing                  |
| Bundling     | **vite-plugin-singlefile** | Produces a single inlined `dist/index.html`    |

No backend, no database, no telemetry.

### Project Structure

```
├── index.html                  # HTML entry point
├── src/
│   ├── App.tsx                 # Tabbed shell (Conversion Tool / User Guide)
│   ├── main.tsx                # React root mount
│   ├── index.css               # Tailwind entry + global page background
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── components/
│   │   ├── FileUploader.tsx    # Drop zone, file bar, sheet selection
│   │   ├── ColumnSelector.tsx  # Keep / Pivot column pickers
│   │   ├── ConversionControls.tsx  # Clear All / Run Conversion actions
│   │   └── GuideTab.tsx        # How to use + example transformation
│   ├── data/
│   │   └── samples.ts          # Built-in sample datasets
│   └── utils/
│       └── converter.ts        # Parsing, unpivot logic, CSV export
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Design System

The UI follows a light theme with a navy header ribbon:

- Navy header (`#0b2542`) with a tabbed navigation ribbon
- Neutral gray canvas on desktop, full-bleed white on mobile
- Blue accents (`#0284c7`) for links and focus rings, emerald for the primary action
- 6px border radius on interactive elements

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Requirements

- **Input:** CSV, TXT, XLSX, XLSB files with a header row
- **Output:** CSV files
- **Max Size:** Limited by browser memory (works well with files up to ~10MB)

---

## Use Cases

This tool is ideal when you need to:

- Prepare data for Power BI, Tableau, or other BI tools
- Convert survey results from wide to long format
- Transform time-series KPI data for analysis
- Normalize data for database imports
- Create flexible datasets for dashboarding

---

## License

This project is open source and available under the MIT License.

---

**Note:** This tool processes all data locally in your browser. No data is transmitted to any server, ensuring your information remains private and secure.
