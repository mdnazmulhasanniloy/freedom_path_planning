import { IGenerateReport } from './generateReport.interface';
import fillFreedomPdf from './generateReport.utils';

export const generateReport = (payload: IGenerateReport) => {
  const result = fillFreedomPdf(payload);
  return result;
};

export const generateReportService = { generateReport };
