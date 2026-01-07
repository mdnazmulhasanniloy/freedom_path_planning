import { IGenerateReport } from './generateReport.interface';
import fillFreedomPdf from './generateReport.utils';

export const generateReport = (payload: IGenerateReport) => {
  fillFreedomPdf(payload);
};

export const generateReportService = { generateReport };
