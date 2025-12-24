import catchAsync from '@app/utils/catchAsync';
import { dashboardService } from './dashboard.service';
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

const dashboardCards = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.dashboardCards();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard cards data get successfully',
    data: result,
  });
});

const dashboardChart = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.dashboardChart(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All dashboard  chart get successfully',
    data: result,
  });
});

const serviceList = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.serviceLIst(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard service list get  successfully',
    data: result,
  });
});

export const dashboardController = {
  dashboardCards,
  serviceList,
  dashboardChart,
};
