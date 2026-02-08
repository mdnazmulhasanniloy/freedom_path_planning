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

const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const result = await generateReportService.getAllReports(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reports fetched successfully',
    data: result,
  });
});

const getSingleReport = catchAsync(async (req: Request, res: Response) => {
  const result = await generateReportService.getSingleReport(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report fetched successfully',
    data: result,
  });
});

const deleteReport = catchAsync(async (req: Request, res: Response) => {
  const result = await generateReportService.deleteReport(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Report deleted successfully',
    data: result,
  });
});

export const generateReportController = {
  generateReport,
  getAllReports,
  getSingleReport,
  deleteReport,
};
