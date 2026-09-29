import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { ColumnSelector } from './components/ColumnSelector';
import { ConversionControls } from './components/ConversionControls';
import { GuideTab } from './components/GuideTab';
import { ParsedFile, ConversionConfig, DataRow } from './types';
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
  const [outputRows, setOutputRows] = useState<DataRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[#0f2744] sm:bg-[#eceff2] sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-[672px]">
        <div className="bg-white min-h-screen sm:min-h-0 sm:rounded-xl sm:shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Navy header */}
          <header className="bg-[#0f2744] px-5 sm:px-7 pt-[max(1.25rem,env(safe-area-inset-top))] sm:pt-7">
            <h1 className="text-[21px] sm:text-[23px] font-bold text-white tracking-tight leading-tight">
              Row-to-Column Conversion Tool
            </h1>
            <p className="mt-1 text-[13px] sm:text-[14px] text-slate-300">
              Transform wide-format datasets into long format by unpivoting selected columns.
            </p>

            <nav className="mt-5 flex gap-5 sm:gap-8 -mx-5 px-0 sm:mx-0" aria-label="Main tabs">
              {tabs.map((t) => {
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`px-5 sm:px-0 pb-3 text-[14px] sm:text-[15px] transition cursor-pointer ${
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
          <main className="px-5 sm:px-7 py-5 sm:py-7 pb-8 sm:pb-7">
            {activeTab === 'tool' ? (
              <div className="space-y-5 sm:space-y-6">
                {/* Import File */}
                <section>
                  <h2 className="text-[16px] font-semibold text-slate-900">Import File</h2>
                  <p className="text-[13px] sm:text-sm text-slate-500">
                    Drag and drop multiple Excel or CSV files
                  </p>
                  <div className="mt-2">
                    <FileUploader
                      currentFile={currentFile}
                      onFileParsed={handleFileParsed}
                      onSheetChanged={handleSheetChanged}
                      onClearFile={handleClearFile}
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
                  <h2 className="text-[18px] font-semibold text-slate-900">Select Columns</h2>
                  <p className="text-[14px] text-slate-500 mt-0.5">
                    Choose which columns to keep and which to pivot
                  </p>
                  <div className="mt-4">
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
                  outputRows={outputRows}
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
