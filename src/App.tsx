import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { ColumnSelector } from './components/ColumnSelector';
import { ConversionControls } from './components/ConversionControls';
import { GuideTab } from './components/GuideTab';
import { ParsedFile, ConversionConfig, DataRow, SampleDataset } from './types';
import { unpivotData } from './utils/converter';

type TabId = 'tool' | 'guide';

const EMPTY_CONFIG: ConversionConfig = {
  keepColumns: [],
  pivotColumns: [],
  includePivotColumnName: true,
  pivotNameHeader: 'KPI Name',
  pivotValueHeader: 'KPI Value',
  skipEmptyValues: false
};

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('tool');
  const [currentFile, setCurrentFile] = useState<ParsedFile | null>(null);
  const [config, setConfig] = useState<ConversionConfig>(EMPTY_CONFIG);
  const [, setOutputRows] = useState<DataRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoadSample = (sample: SampleDataset) => {
    setCurrentFile({
      fileName: sample.fileName,
      fileSize: 1024 * 12,
      sheets: ['SampleData'],
      selectedSheet: 'SampleData',
      headers: sample.headers,
      rows: sample.rows
    });
    const newConfig: ConversionConfig = {
      keepColumns: sample.defaultKeep,
      pivotColumns: sample.defaultPivot,
      includePivotColumnName: true,
      pivotNameHeader: sample.pivotNameHeader,
      pivotValueHeader: sample.pivotValueHeader,
      skipEmptyValues: false
    };
    setConfig(newConfig);
    setOutputRows(unpivotData(sample.rows, newConfig));
    setErrorMessage(null);
  };

  const handleFileParsed = (parsed: ParsedFile) => {
    setCurrentFile(parsed);
    // Default: first column kept, rest pivoted — user adjusts in the boxes below
    const newConfig: ConversionConfig = {
      ...EMPTY_CONFIG,
      keepColumns: parsed.headers.length > 0 ? [parsed.headers[0]] : [],
      pivotColumns: parsed.headers.slice(1)
    };
    setConfig(newConfig);
    setOutputRows([]);
  };

  const handleSheetChanged = (newSheet: string, headers: string[], rows: any[]) => {
    if (!currentFile) return;
    setCurrentFile({ ...currentFile, selectedSheet: newSheet, headers, rows });
    setConfig({
      ...EMPTY_CONFIG,
      keepColumns: headers.length > 0 ? [headers[0]] : [],
      pivotColumns: headers.slice(1)
    });
    setOutputRows([]);
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    setConfig(EMPTY_CONFIG);
    setOutputRows([]);
    setErrorMessage(null);
  };

  const handleConfigChange = (newConfig: ConversionConfig) => {
    setConfig(newConfig);
    if (currentFile && currentFile.rows.length > 0 && newConfig.pivotColumns.length > 0) {
      setOutputRows(unpivotData(currentFile.rows, newConfig));
    } else {
      setOutputRows([]);
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'tool', label: 'Conversion Tool' },
    { id: 'guide', label: 'User Guide' }
  ];

  return (
    <div className="min-h-screen bg-white sm:bg-[#e8ecf1] sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-[620px]">
        <div className="bg-white min-h-screen sm:min-h-0 sm:rounded-xl sm:shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Navy header */}
          <header className="bg-[#0b2542] px-4 sm:px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-5">
            <h1 className="text-[20px] sm:text-[18px] font-extrabold text-white tracking-tight leading-tight">
              Row-to-Column Conversion Tool
            </h1>
            <p className="mt-1 sm:mt-0.5 text-[12px] text-slate-200 sm:text-slate-300">
              Transform wide-format datasets into long format by unpivoting selected columns.
            </p>

            <nav className="mt-3 sm:mt-3.5 flex gap-0 sm:gap-6 -mx-4 px-0 sm:mx-0" aria-label="Main tabs">
              {tabs.map((t) => {
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`px-4 sm:px-0 pb-2.5 text-[13px] transition cursor-pointer ${
                      active
                        ? 'text-white font-semibold border-b-2 border-white -mb-px'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </header>

          {/* Body */}
          <main className="px-4 sm:px-5 py-4 pb-8 sm:pb-4">
            {activeTab === 'tool' ? (
              <div className="space-y-4">
                {/* Import File */}
                <section>
                  <h2 className="text-[15px] sm:text-[13px] font-bold text-slate-900">Import File</h2>
                  <p className="text-[12px] text-slate-500">
                    Drag and drop multiple Excel or CSV files
                  </p>
                  <div className="mt-2">
                    <FileUploader
                      currentFile={currentFile}
                      onFileParsed={handleFileParsed}
                      onSheetChanged={handleSheetChanged}
                      onClearFile={handleClearFile}
                      onLoadSample={handleLoadSample}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      errorMessage={errorMessage}
                      setErrorMessage={setErrorMessage}
                    />
                  </div>
                </section>

                <div className="border-t border-slate-200" />

                {/* Select Columns — always visible, empty until a file loads */}
                <section>
                  <h2 className="text-[15px] sm:text-[13px] font-bold text-slate-900">Select Columns</h2>
                  <p className="text-[12px] text-slate-500">
                    Choose which columns to keep and which to pivot
                  </p>
                  <div className="mt-2.5">
                    <ColumnSelector
                      headers={currentFile ? currentFile.headers : []}
                      config={config}
                      onChangeConfig={handleConfigChange}
                    />
                  </div>
                </section>

                {/* Actions */}
                <ConversionControls
                  rows={currentFile ? currentFile.rows : []}
                  config={config}
                  setOutputRows={setOutputRows}
                  sourceFileName={currentFile?.fileName}
                  onClearAll={handleClearFile}
                />
              </div>
            ) : (
              <GuideTab />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
