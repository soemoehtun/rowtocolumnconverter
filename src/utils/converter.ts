import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { DataRow, ConversionConfig, ParsedFile } from '../types';

export function parseFile(file: File): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const fileSize = file.size;
    const extension = fileName.split('.').pop()?.toLowerCase() || '';

    if (extension === 'csv' || extension === 'txt' || extension === 'tsv') {
      // Use PapaParse for CSV / text
      Papa.parse<DataRow>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          const headers = (results.meta.fields || []).filter((h) => h && h.trim().length > 0);
          const rows = results.data.filter((r) => r && Object.keys(r).length > 0);
          resolve({
            fileName,
            fileSize,
            sheets: ['Data'],
            selectedSheet: 'Data',
            headers,
            rows
          });
        },
        error: (err) => {
          reject(new Error(`Failed to parse text file: ${err.message}`));
        }
      });
    } else if (['xlsx', 'xls', 'xlsb', 'xlsm'].includes(extension)) {
      // Use XLSX
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheets = workbook.SheetNames;
          if (!sheets.length) {
            throw new Error('Workbook contains no sheets.');
          }
          const selectedSheet = sheets[0];
          const worksheet = workbook.Sheets[selectedSheet];
          const rawJson = XLSX.utils.sheet_to_json<DataRow>(worksheet, { defval: '' });

          // Extract headers
          let headers: string[] = [];
          if (rawJson.length > 0) {
            headers = Object.keys(rawJson[0]);
          } else {
            // Read headers directly from range A1:Z1
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
              if (cell && cell.v !== undefined) {
                headers.push(String(cell.v));
              }
            }
          }

          resolve({
            fileName,
            fileSize,
            rawWorkbook: workbook,
            sheets,
            selectedSheet,
            headers,
            rows: rawJson
          });
        } catch (err: any) {
          reject(new Error(`Failed to parse Excel file: ${err.message || 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error(`Unsupported file type: .${extension}. Please upload .csv, .txt, .xlsx, or .xlsb`));
    }
  });
}

export function loadSheetFromWorkbook(workbook: any, sheetName: string): { headers: string[]; rows: DataRow[] } {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return { headers: [], rows: [] };
  const rows = XLSX.utils.sheet_to_json<DataRow>(worksheet, { defval: '' });
  let headers: string[] = [];
  if (rows.length > 0) {
    headers = Object.keys(rows[0]);
  } else {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
      if (cell && cell.v !== undefined) {
        headers.push(String(cell.v));
      }
    }
  }
  return { headers, rows };
}

export function unpivotData(rows: DataRow[], config: ConversionConfig): DataRow[] {
  const {
    keepColumns,
    pivotColumns,
    includePivotColumnName,
    pivotNameHeader = 'KPI Name',
    pivotValueHeader = 'KPI Value',
    skipEmptyValues = false
  } = config;

  if (!rows || rows.length === 0 || pivotColumns.length === 0) {
    return [];
  }

  const output: DataRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Base object with preserved/kept columns
    const baseRow: Record<string, any> = {};
    for (const col of keepColumns) {
      baseRow[col] = row[col] !== undefined ? row[col] : '';
    }

    // Pivot columns into rows
    for (const pCol of pivotColumns) {
      const val = row[pCol];
      if (skipEmptyValues && (val === undefined || val === null || val === '')) {
        continue;
      }

      const newRow: Record<string, any> = { ...baseRow };
      if (includePivotColumnName) {
        newRow[pivotNameHeader.trim() || 'KPI Name'] = pCol;
      }
      newRow[pivotValueHeader.trim() || 'KPI Value'] = val !== undefined ? val : '';
      output.push(newRow);
    }
  }

  return output;
}

export function downloadCSV(data: DataRow[], filename = 'output-data.csv'): void {
  if (!data || data.length === 0) return;
  const csv = Papa.unparse(data);
  // Add UTF-8 BOM so Excel opens non-ASCII characters cleanly
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExcel(data: DataRow[], filename = 'output-data.xlsx'): void {
  if (!data || data.length === 0) return;
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ConvertedData');
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

export function copyAsTSV(data: DataRow[]): Promise<boolean> {
  if (!data || data.length === 0) return Promise.resolve(false);
  const tsv = Papa.unparse(data, { delimiter: '\t' });
  return navigator.clipboard.writeText(tsv).then(() => true).catch(() => false);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
