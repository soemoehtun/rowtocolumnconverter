import React, { useState } from 'react';
import { DataRow, ConversionConfig } from '../types';
import { unpivotData, downloadCSV } from '../utils/converter';

interface ConversionControlsProps {
  rows: DataRow[];
  config: ConversionConfig;
  setOutputRows: (rows: DataRow[]) => void;
  sourceFileName?: string;
  onClearAll: () => void;
}

export const ConversionControls: React.FC<ConversionControlsProps> = ({
  rows,
  config,
  setOutputRows,
  sourceFileName,
  onClearAll
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleRun = () => {
    if (rows.length === 0) {
      setStatus({ type: 'error', msg: 'Please import a data file first.' });
      return;
    }
    if (config.pivotColumns.length === 0) {
      setStatus({ type: 'error', msg: 'Please select at least one column to pivot.' });
      return;
    }
    setStatus(null);
    setIsProcessing(true);
    setTimeout(() => {
      const converted = unpivotData(rows, config);
      setOutputRows(converted);
      const base = (sourceFileName || 'output-data').replace(/\.[^/.]+$/, '');
      downloadCSV(converted, `${base}-unpivoted.csv`);
      setIsProcessing(false);
      setStatus({
        type: 'success',
        msg: `Converted ${rows.length.toLocaleString()} rows × ${config.pivotColumns.length} columns → ${converted.length.toLocaleString()} rows downloaded.`
      });
    }, 60);
  };

  const handleClear = () => {
    setStatus(null);
    onClearAll();
  };

  return (
    <div>
      {status && (
        <div
          role={status.type === 'error' ? 'alert' : 'status'}
          className={`mb-2 rounded-md border px-2.5 py-1.5 text-[12px] ${
            status.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1 sm:pt-0">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 sm:flex-none rounded-md border border-slate-300 bg-white px-4 py-2 sm:py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 cursor-pointer transition"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleRun}
          disabled={isProcessing}
          className="flex-[1.1] sm:flex-none rounded-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-4 py-2 sm:py-1.5 text-[13px] font-bold text-white shadow-md shadow-emerald-500/20 disabled:opacity-60 cursor-pointer transition"
        >
          {isProcessing ? 'Converting...' : 'Run Conversion'}
        </button>
      </div>
    </div>
  );
};
