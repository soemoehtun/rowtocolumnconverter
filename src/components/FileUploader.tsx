import React, { useRef, useState } from 'react';
import { ParsedFile, SampleDataset } from '../types';
import { formatFileSize, parseFile, loadSheetFromWorkbook } from '../utils/converter';
import { SAMPLE_DATASETS } from '../data/samples';

interface FileUploaderProps {
  currentFile: ParsedFile | null;
  onFileParsed: (file: ParsedFile) => void;
  onSheetChanged: (newSheet: string, headers: string[], rows: any[]) => void;
  onClearFile: () => void;
  onLoadSample: (sample: SampleDataset) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  currentFile,
  onFileParsed,
  onSheetChanged,
  onClearFile,
  onLoadSample,
  isLoading,
  setIsLoading,
  errorMessage,
  setErrorMessage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileProcess = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const parsed = await parseFile(file);
      if (parsed.headers.length === 0) {
        throw new Error('No headers found in the file. Please ensure row 1 contains column names.');
      }
      onFileParsed(parsed);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process file. Please ensure it is a valid CSV or Excel file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleSheetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = e.target.value;
    if (!currentFile || !currentFile.rawWorkbook) return;
    const { headers, rows } = loadSheetFromWorkbook(currentFile.rawWorkbook, sheetName);
    onSheetChanged(sheetName, headers, rows);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt,.tsv,.xlsx,.xlsb,.xls,.xlsm"
        onChange={handleInputChange}
        className="hidden"
      />

      {!currentFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-lg sm:rounded-md border-[1.5px] sm:border border-dashed px-4 py-8 sm:py-5 text-center cursor-pointer transition bg-white ${
            isDragOver ? 'border-[#0284c7] bg-sky-50/50' : 'border-slate-300 hover:border-[#0284c7]'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-[26px] sm:text-[22px] leading-none select-none">📁</div>
            <p className="mt-2 sm:mt-1.5 text-[14px] sm:text-[13px] text-slate-700">Drag &amp; drop your data file here</p>
            <p className="text-[12px]">
              <span className="text-slate-500">or </span>
              <span className="text-[#0284c7] font-medium">
                browse files (.csv, .txt, .xlsx, .xlsb)
              </span>
            </p>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-white/85 rounded-md flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-[#0284c7] font-medium">
                <span className="w-4 h-4 border-2 border-[#0284c7]/30 border-t-[#0284c7] rounded-full animate-spin" />
                Reading and parsing data...
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          className={`rounded-md border bg-white px-3 py-2 transition ${
            isDragOver ? 'border-[#0284c7] ring-2 ring-[#0284c7]/20' : 'border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">📁</span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-900 truncate">
                  {currentFile.fileName}{' '}
                  <span className="font-mono font-normal text-[11px] text-slate-500">
                    ({formatFileSize(currentFile.fileSize)})
                  </span>
                </p>
                <p className="text-[11px] text-slate-500">
                  {currentFile.rows.length.toLocaleString()} rows • {currentFile.headers.length}{' '}
                  columns
                  {currentFile.sheets.length > 1 && ` • ${currentFile.selectedSheet}`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClearFile}
              aria-label="Remove file"
              title="Remove file"
              className="shrink-0 w-7 h-7 rounded-md text-slate-400 hover:text-red-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
          {isLoading && (
            <p className="mt-2 text-[13px] text-[#0284c7]">Reading and parsing data...</p>
          )}
        </div>
      )}

      {/* Sheet selection — separate field, only for multi-sheet workbooks */}
      {currentFile && currentFile.sheets.length > 1 && (
        <div className="mt-3">
          <label
            htmlFor="sheet-select"
            className="block text-[13px] text-slate-900"
          >
            Select Sheet
          </label>
          <p className="text-[11px] text-slate-500">
            Choose which worksheet to convert ({currentFile.sheets.length} sheets found)
          </p>
          <select
            id="sheet-select"
            value={currentFile.selectedSheet}
            onChange={handleSheetSelect}
            className="mt-1.5 w-full sm:w-72 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-[13px] text-slate-800 outline-none transition focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20"
          >
            {currentFile.sheets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mt-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[12px] text-red-700 flex items-start justify-between gap-2"
        >
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="font-bold leading-none cursor-pointer"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {!currentFile && !errorMessage && (
        <p className="mt-1.5 text-[11px] text-slate-400">
          No file handy? Try a sample:{' '}
          {SAMPLE_DATASETS.map((s, i) => (
            <span key={s.name}>
              {i > 0 && ' · '}
              <button
                type="button"
                onClick={() => onLoadSample(s)}
                className="text-[#0284c7] hover:underline cursor-pointer"
              >
                {s.name}
              </button>
            </span>
          ))}
        </p>
      )}
    </div>
  );
};
