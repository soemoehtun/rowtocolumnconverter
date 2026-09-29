import React from 'react';

const KEEP = 'bg-[#e8f8f2] text-[#0f9d8a]';
const PIVOT = 'bg-[#e8f4fc] text-[#1d8fbf]';
const TH = 'px-1 sm:px-2 py-1 sm:py-1.5 font-semibold whitespace-nowrap';
const TD = 'px-1 sm:px-2 py-[3px] sm:py-1 whitespace-nowrap';

const INPUT_HEAD = ['Site', 'Date', 'KPI1', 'KPI2'];
const OUTPUT_HEAD = ['Site', 'Date', 'KPI Name', 'KPI Value'];

const INPUT_ROWS = [
  ['A', '2025-01-01', '10', '20'],
  ['A', '2025-01-02', '15', '25'],
  ['B', '2025-01-01', '5', '8']
];

const OUTPUT_ROWS = [
  ['A', '2025-01-01', 'KPI1', '10'],
  ['A', '2025-01-01', 'KPI2', '20'],
  ['A', '2025-01-02', 'KPI1', '15'],
  ['A', '2025-01-02', 'KPI2', '25'],
  ['B', '2025-01-01', 'KPI1', '5'],
  ['B', '2025-01-01', 'KPI2', '8']
];

const Step: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => (
  <li className="flex items-start gap-2.5 sm:gap-2.5">
    <span className="mt-px w-5 h-5 sm:w-[18px] sm:h-[18px] shrink-0 rounded-full bg-[#0b6aa2] text-white text-[10px] font-bold flex items-center justify-center">
      {n}
    </span>
    <p className="text-[13px] leading-relaxed sm:leading-snug text-slate-600">{children}</p>
  </li>
);

const B: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-bold text-slate-900">{children}</span>
);

const ExampleTable: React.FC<{ title: string; head: string[]; rows: string[][] }> = ({
  title,
  head,
  rows
}) => (
  <div className="flex-1 min-w-0">
    <p className="text-[10px] sm:text-[12px] font-bold text-slate-800 mb-1.5">{title}</p>
    <div className="rounded-md overflow-hidden border border-slate-200">
      <table className="w-full text-left border-collapse text-[8.5px] sm:text-[11px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={h} className={`${TH} ${i < 2 ? KEEP : PIVOT}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-slate-200/70">
              {r.map((c, ci) => (
                <td key={ci} className={`${TD} ${ci < 2 ? KEEP : PIVOT}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const GuideTab: React.FC = () => {
  return (
    <div className="pt-1 sm:pt-0">
      <section>
        <h2 className="text-[15px] sm:text-[13px] font-bold text-slate-900">How to use</h2>
        <ol className="mt-3 space-y-2.5">
          <Step n={1}>
            <B>Upload your file.</B> Drag and drop a CSV or Excel file or click <B>browse files</B>{' '}
            to select one.
          </Step>
          <Step n={2}>
            <B>Select columns.</B> Choose which columns to <B>keep</B> (appear in every output row)
            and which to <B>pivot</B> (convert to rows).
          </Step>
          <Step n={3}>
            <B>Run conversion.</B> Click <B>Run Conversion</B> to unpivot your data.
          </Step>
          <Step n={4}>
            <B>Download result.</B> The converted file is automatically downloaded as{' '}
            <B>output-data.csv</B>.
          </Step>
        </ol>
      </section>

      <div className="my-5 sm:my-4 border-t border-slate-200" />

      <section>
        <h2 className="text-[15px] sm:text-[13px] font-bold text-slate-900">
          Example Transformation
        </h2>

        <div className="mt-3 flex flex-row items-start gap-1.5 sm:gap-2">
          <ExampleTable title="Input (Wide Format)" head={INPUT_HEAD} rows={INPUT_ROWS} />

          <div className="flex items-center justify-center shrink-0 pt-7 sm:pt-8">
            <span
              className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#e8f4fc] text-[#1d8fbf] flex items-center justify-center"
              aria-hidden="true"
            >
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>

          <ExampleTable title="Output (Long Format)" head={OUTPUT_HEAD} rows={OUTPUT_ROWS} />
        </div>
      </section>
    </div>
  );
};
