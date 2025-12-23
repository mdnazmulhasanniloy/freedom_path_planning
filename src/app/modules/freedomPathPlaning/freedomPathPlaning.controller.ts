

import catchAsync from '@app/utils/catchAsync';
import { freedomPathPlaningService } from './freedomPathPlaning.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createFreedomPathPlaning = catchAsync(async (req: Request, res: Response) => {
 const result = await freedomPathPlaningService.createFreedomPathPlaning(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FreedomPathPlaning created successfully',
    data: result,
  });

});

const getAllFreedomPathPlaning = catchAsync(async (req: Request, res: Response) => {

 const result = await freedomPathPlaningService.getAllFreedomPathPlaning(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All freedomPathPlaning fetched successfully',
    data: result,
  });

});

const getFreedomPathPlaningById = catchAsync(async (req: Request, res: Response) => {
 const result = await freedomPathPlaningService.getFreedomPathPlaningById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FreedomPathPlaning fetched successfully',
    data: result,
  });

});
const updateFreedomPathPlaning = catchAsync(async (req: Request, res: Response) => {
const result = await freedomPathPlaningService.updateFreedomPathPlaning(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FreedomPathPlaning updated successfully',
    data: result,
  });

});


const deleteFreedomPathPlaning = catchAsync(async (req: Request, res: Response) => {
 const result = await freedomPathPlaningService.deleteFreedomPathPlaning(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FreedomPathPlaning deleted successfully',
    data: result,
  });

});

export const freedomPathPlaningController = {
  createFreedomPathPlaning,
  getAllFreedomPathPlaning,
  getFreedomPathPlaningById,
  updateFreedomPathPlaning,
  deleteFreedomPathPlaning,
};