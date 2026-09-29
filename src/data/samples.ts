import { SampleDataset } from '../types';
import * as XLSX from 'xlsx';

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    name: 'Site KPI Metrics (Default)',
    description: 'The standard sample dataset from the repository with Sites, Dates, and KPIs',
    fileName: 'sample-data.xlsx',
    headers: ['Site', 'Date', 'KPI1', 'KPI2', 'KPI3', 'Target'],
    defaultKeep: ['Site', 'Date'],
    defaultPivot: ['KPI1', 'KPI2', 'KPI3', 'Target'],
    pivotNameHeader: 'KPI Name',
    pivotValueHeader: 'KPI Value',
    rows: [
      { Site: 'A', Date: '2025-01-01', KPI1: 10, KPI2: 20, KPI3: 35, Target: 50 },
      { Site: 'A', Date: '2025-01-02', KPI1: 15, KPI2: 25, KPI3: 40, Target: 50 },
      { Site: 'B', Date: '2025-01-01', KPI1: 5,  KPI2: 8,  KPI3: 12, Target: 30 },
      { Site: 'B', Date: '2025-01-02', KPI1: 7,  KPI2: 11, KPI3: 15, Target: 30 },
      { Site: 'C', Date: '2025-01-01', KPI1: 12, KPI2: 18, KPI3: 22, Target: 45 },
      { Site: 'C', Date: '2025-01-02', KPI1: 14, KPI2: 19, KPI3: 26, Target: 45 },
      { Site: 'D', Date: '2025-01-01', KPI1: 9,  KPI2: 16, KPI3: 20, Target: 35 },
      { Site: 'D', Date: '2025-01-02', KPI1: 11, KPI2: 17, KPI3: 24, Target: 35 }
    ]
  },
  {
    name: 'Regional Financials by Month',
    description: 'Monthly department revenues in wide format to unpivot for time-series charts',
    fileName: 'financial-data.csv',
    headers: ['Department', 'Region', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    defaultKeep: ['Department', 'Region'],
    defaultPivot: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    pivotNameHeader: 'Month',
    pivotValueHeader: 'Revenue ($k)',
    rows: [
      { Department: 'Sales', Region: 'North America', Jan: 140, Feb: 165, Mar: 180, Apr: 175, May: 190, Jun: 210 },
      { Department: 'Sales', Region: 'Europe', Jan: 95, Feb: 110, Mar: 125, Apr: 120, May: 135, Jun: 150 },
      { Department: 'Marketing', Region: 'North America', Jan: 40, Feb: 45, Mar: 50, Apr: 48, May: 52, Jun: 58 },
      { Department: 'Marketing', Region: 'Europe', Jan: 30, Feb: 32, Mar: 36, Apr: 35, May: 38, Jun: 42 },
      { Department: 'R&D', Region: 'Global', Jan: 80, Feb: 82, Mar: 85, Apr: 85, May: 88, Jun: 90 }
    ]
  },
  {
    name: 'Customer Survey Feedback',
    description: 'Survey questions across categories unpivoted for Power BI slicers',
    fileName: 'survey-results.xlsx',
    headers: ['ResponseID', 'Segment', 'Tier', 'EaseOfUse', 'SupportQuality', 'FeatureSet', 'LikelihoodToRenew'],
    defaultKeep: ['ResponseID', 'Segment', 'Tier'],
    defaultPivot: ['EaseOfUse', 'SupportQuality', 'FeatureSet', 'LikelihoodToRenew'],
    pivotNameHeader: 'Survey Question',
    pivotValueHeader: 'Rating (1-5)',
    rows: [
      { ResponseID: 'R-1001', Segment: 'Enterprise', Tier: 'Platinum', EaseOfUse: 4, SupportQuality: 5, FeatureSet: 4, LikelihoodToRenew: 5 },
      { ResponseID: 'R-1002', Segment: 'Mid-Market', Tier: 'Gold', EaseOfUse: 5, SupportQuality: 4, FeatureSet: 5, LikelihoodToRenew: 4 },
      { ResponseID: 'R-1003', Segment: 'SMB', Tier: 'Silver', EaseOfUse: 3, SupportQuality: 3, FeatureSet: 4, LikelihoodToRenew: 3 },
      { ResponseID: 'R-1004', Segment: 'Enterprise', Tier: 'Gold', EaseOfUse: 5, SupportQuality: 5, FeatureSet: 5, LikelihoodToRenew: 5 },
      { ResponseID: 'R-1005', Segment: 'SMB', Tier: 'Bronze', EaseOfUse: 4, SupportQuality: 4, FeatureSet: 3, LikelihoodToRenew: 4 }
    ]
  }
];

export function downloadSampleExcel(dataset = SAMPLE_DATASETS[0]) {
  const ws = XLSX.utils.json_to_sheet(dataset.rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SampleData');
  
  // Also add a second sheet to demonstrate multi-sheet Excel selection
  const ws2 = XLSX.utils.json_to_sheet([
    { Metric: 'TotalSites', Value: 4 },
    { Metric: 'TargetDate', Value: '2025-12-31' },
    { Metric: 'Status', Value: 'Active' }
  ]);
  XLSX.utils.book_append_sheet(wb, ws2, 'Metadata');

  XLSX.writeFile(wb, dataset.fileName);
}
