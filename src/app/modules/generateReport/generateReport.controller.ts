import catchAsync from '@app/utils/catchAsync';
import { generateReportService } from './generateReport.service';
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

const generateReport = catchAsync(async (req: Request, res: Response) => {
  const result = await generateReportService.generateReport(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report generated successfully',
    data: result,
  });
});

export const generateReportController = {
  generateReport,
};
