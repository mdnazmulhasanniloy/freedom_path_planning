import catchAsync from '@app/utils/catchAsync';
import { associatesService } from './associates.service';
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';

const createAssociates = catchAsync(async (req: Request, res: Response) => {
  const result = await associatesService.createAssociates(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Associates created successfully',
    data: result,
  });
});

const getAllAssociates = catchAsync(async (req: Request, res: Response) => {
  const result = await associatesService.getAllAssociates(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All associates fetched successfully',
    data: result,
  });
});

const getAssociatesById = catchAsync(async (req: Request, res: Response) => {
  const result = await associatesService.getAssociatesById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Associates fetched successfully',
    data: result,
  });
});

const updateAssociates = catchAsync(async (req: Request, res: Response) => {
  const result = await associatesService.updateAssociates(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Associates updated successfully',
    data: result,
  });
});

const deleteAssociates = catchAsync(async (req: Request, res: Response) => {
  const result = await associatesService.deleteAssociates(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Associates deleted successfully',
    data: result,
  });
});

export const associatesController = {
  createAssociates,
  getAllAssociates,
  getAssociatesById,
  updateAssociates,
  deleteAssociates,
};
