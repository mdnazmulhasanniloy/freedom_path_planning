

import catchAsync from '@app/utils/catchAsync';
import { includedServiceService } from './includedService.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createIncludedService = catchAsync(async (req: Request, res: Response) => {
 const result = await includedServiceService.createIncludedService(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'IncludedService created successfully',
    data: result,
  });

});

const getAllIncludedService = catchAsync(async (req: Request, res: Response) => {

 const result = await includedServiceService.getAllIncludedService(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All includedService fetched successfully',
    data: result,
  });

});

const getIncludedServiceById = catchAsync(async (req: Request, res: Response) => {
 const result = await includedServiceService.getIncludedServiceById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'IncludedService fetched successfully',
    data: result,
  });

});
const updateIncludedService = catchAsync(async (req: Request, res: Response) => {
const result = await includedServiceService.updateIncludedService(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'IncludedService updated successfully',
    data: result,
  });

});


const deleteIncludedService = catchAsync(async (req: Request, res: Response) => {
 const result = await includedServiceService.deleteIncludedService(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'IncludedService deleted successfully',
    data: result,
  });

});

export const includedServiceController = {
  createIncludedService,
  getAllIncludedService,
  getIncludedServiceById,
  updateIncludedService,
  deleteIncludedService,
};