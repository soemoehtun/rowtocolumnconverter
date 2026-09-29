import React from 'react';
import { ConversionConfig } from '../types';

interface ColumnSelectorProps {
  headers: string[];
  config: ConversionConfig;
  onChangeConfig: (newConfig: ConversionConfig) => void;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  headers,
  config,
  onChangeConfig
}) => {
  const handleToggleKeep = (col: string) => {
    const next = config.keepColumns.includes(col)
      ? config.keepColumns.filter((c) => c !== col)
      : [...config.keepColumns, col];
    onChangeConfig({ ...config, keepColumns: next });
  };

  const handleTogglePivot = (col: string) => {
    const next = config.pivotColumns.includes(col)
      ? config.pivotColumns.filter((c) => c !== col)
      : [...config.pivotColumns, col];
    onChangeConfig({ ...config, pivotColumns: next });
  };

  const isAllKeepSelected =
    headers.length > 0 && headers.every((h) => config.keepColumns.includes(h));
  const isAllPivotSelected =
    headers.length > 0 && headers.every((h) => config.pivotColumns.includes(h));

  const handleKeepSelectAll = (checked: boolean) => {
    onChangeConfig({ ...config, keepColumns: checked ? [...headers] : [] });
  };

  const handlePivotSelectAll = (checked: boolean) => {
    onChangeConfig({ ...config, pivotColumns: checked ? [...headers] : [] });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-3">
      {/* Columns to Keep */}
      <div>
        <p className="text-[13px] text-slate-900">Columns to Keep</p>
        <p className="text-[11px] text-slate-500">
          These columns appear in every output row
        </p>
        <label className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isAllKeepSelected}
            onChange={(e) => handleKeepSelectAll(e.target.checked)}
            disabled={headers.length === 0}
            className="w-3.5 h-3.5 rounded disabled:opacity-40"
          />
          Select All
        </label>
        <div className="mt-1.5 h-[96px] overflow-y-auto rounded-md border border-slate-300 bg-white p-1">
          {headers.map((col) => {
            const checked = config.keepColumns.includes(col);
            return (
              <label
                key={`keep-${col}`}
                className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[12px] text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleKeep(col)}
                  className="w-3.5 h-3.5 rounded shrink-0"
                />
                <span className="truncate">{col}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Columns to Pivot */}
      <div>
        <p className="text-[13px] text-slate-900">Columns to Pivot</p>
        <p className="text-[11px] text-slate-500">
          These columns are converted to rows
        </p>
        <div className="mt-1 flex items-center flex-wrap gap-x-3 gap-y-0.5">
          <label className="inline-flex items-center gap-1.5 text-[12px] text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={config.includePivotColumnName}
              onChange={(e) =>
                onChangeConfig({ ...config, includePivotColumnName: e.target.checked })
              }
              className="w-3.5 h-3.5 rounded"
            />
            Include Pivot Column Name
          </label>
          <label className="inline-flex items-center gap-1.5 text-[12px] text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllPivotSelected}
              onChange={(e) => handlePivotSelectAll(e.target.checked)}
              disabled={headers.length === 0}
              className="w-3.5 h-3.5 rounded disabled:opacity-40"
            />
            Select All
          </label>
        </div>
        <div className="mt-1.5 h-[96px] overflow-y-auto rounded-md border border-slate-300 bg-white p-1">
          {headers.map((col) => {
            const checked = config.pivotColumns.includes(col);
            return (
              <label
                key={`pivot-${col}`}
                className="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[12px] text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleTogglePivot(col)}
                  className="w-3.5 h-3.5 rounded shrink-0"
                />
                <span className="truncate">{col}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
