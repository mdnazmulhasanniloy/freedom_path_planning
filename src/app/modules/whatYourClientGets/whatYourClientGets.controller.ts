

import catchAsync from '@app/utils/catchAsync';
import { whatYourClientGetsService } from './whatYourClientGets.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createWhatYourClientGets = catchAsync(async (req: Request, res: Response) => {
 const result = await whatYourClientGetsService.createWhatYourClientGets(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'WhatYourClientGets created successfully',
    data: result,
  });

});

const getAllWhatYourClientGets = catchAsync(async (req: Request, res: Response) => {

 const result = await whatYourClientGetsService.getAllWhatYourClientGets(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All whatYourClientGets fetched successfully',
    data: result,
  });

});

const getWhatYourClientGetsById = catchAsync(async (req: Request, res: Response) => {
 const result = await whatYourClientGetsService.getWhatYourClientGetsById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'WhatYourClientGets fetched successfully',
    data: result,
  });

});
const updateWhatYourClientGets = catchAsync(async (req: Request, res: Response) => {
const result = await whatYourClientGetsService.updateWhatYourClientGets(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'WhatYourClientGets updated successfully',
    data: result,
  });

});


const deleteWhatYourClientGets = catchAsync(async (req: Request, res: Response) => {
 const result = await whatYourClientGetsService.deleteWhatYourClientGets(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'WhatYourClientGets deleted successfully',
    data: result,
  });

});

export const whatYourClientGetsController = {
  createWhatYourClientGets,
  getAllWhatYourClientGets,
  getWhatYourClientGetsById,
  updateWhatYourClientGets,
  deleteWhatYourClientGets,
};