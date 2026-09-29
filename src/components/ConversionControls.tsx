import React, { useState } from 'react';
import { DataRow, ConversionConfig } from '../types';
import { unpivotData, downloadCSV } from '../utils/converter';

interface ConversionControlsProps {
  rows: DataRow[];
  config: ConversionConfig;
  outputRows: DataRow[];
  setOutputRows: (rows: DataRow[]) => void;
  sourceFileName?: string;
  onClearAll: () => void;
}

export const ConversionControls: React.FC<ConversionControlsProps> = ({
  rows,
  config,
  outputRows,
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
          className={`mb-3 rounded-md border px-3 py-2 text-sm ${
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
          className="flex-1 sm:flex-none rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer transition"
        >
          Clear All
        </button>
        <button
          type="button"
          onClick={handleRun}
          disabled={isProcessing}
          className="flex-[1.1] sm:flex-none rounded-md bg-[#2c6bb3] hover:bg-[#255fa3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 cursor-pointer transition"
        >
          {isProcessing ? 'Converting...' : 'Run Conversion'}
        </button>
      </div>

      {rows.length > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Result
          </h3>
          <div className="rounded-md border border-slate-200 bg-slate-100/70 px-4 py-1">
            {[
              { label: 'Input rows:', value: rows.length.toLocaleString() },
              { label: 'Columns kept:', value: String(config.keepColumns.length) },
              { label: 'Columns pivoted:', value: String(config.pivotColumns.length) },
              {
                label: 'Output rows:',
                value: (outputRows.length || rows.length * config.pivotColumns.length).toLocaleString()
              }
            ].map((item, index, values) => (
              <div
                key={item.label}
                className={`flex items-center justify-between gap-4 py-2.5 ${
                  index < values.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <span className="font-mono text-sm text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
