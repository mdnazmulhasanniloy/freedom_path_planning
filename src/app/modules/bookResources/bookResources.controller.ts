

import catchAsync from '@app/utils/catchAsync';
import { bookResourcesService } from './bookResources.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createBookResources = catchAsync(async (req: Request, res: Response) => {
 const result = await bookResourcesService.createBookResources(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'BookResources created successfully',
    data: result,
  });

});

const getAllBookResources = catchAsync(async (req: Request, res: Response) => {

 const result = await bookResourcesService.getAllBookResources(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All bookResources fetched successfully',
    data: result,
  });

});

const getBookResourcesById = catchAsync(async (req: Request, res: Response) => {
 const result = await bookResourcesService.getBookResourcesById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'BookResources fetched successfully',
    data: result,
  });

});
const updateBookResources = catchAsync(async (req: Request, res: Response) => {
const result = await bookResourcesService.updateBookResources(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'BookResources updated successfully',
    data: result,
  });

});


const deleteBookResources = catchAsync(async (req: Request, res: Response) => {
 const result = await bookResourcesService.deleteBookResources(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'BookResources deleted successfully',
    data: result,
  });

});

export const bookResourcesController = {
  createBookResources,
  getAllBookResources,
  getBookResourcesById,
  updateBookResources,
  deleteBookResources,
};