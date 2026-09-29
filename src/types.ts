export type DataRow = Record<string, any>;

export interface ParsedFile {
  fileName: string;
  fileSize: number;
  rawWorkbook?: any;
  sheets: string[];
  selectedSheet: string;
  headers: string[];
  rows: DataRow[];
}

export interface ConversionConfig {
  keepColumns: string[];
  pivotColumns: string[];
  includePivotColumnName: boolean;
  pivotNameHeader: string;
  pivotValueHeader: string;
  skipEmptyValues: boolean;
}

export interface SampleDataset {
  name: string;
  description: string;
  fileName: string;
  headers: string[];
  defaultKeep: string[];
  defaultPivot: string[];
  pivotNameHeader: string;
  pivotValueHeader: string;
  rows: DataRow[];
}
