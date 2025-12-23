

import catchAsync from '@app/utils/catchAsync';
import { aboutSteveDerayService } from './aboutSteveDeray.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createAboutSteveDeray = catchAsync(async (req: Request, res: Response) => {
 const result = await aboutSteveDerayService.createAboutSteveDeray(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutSteveDeray created successfully',
    data: result,
  });

});

const getAllAboutSteveDeray = catchAsync(async (req: Request, res: Response) => {

 const result = await aboutSteveDerayService.getAllAboutSteveDeray(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All aboutSteveDeray fetched successfully',
    data: result,
  });

});

const getAboutSteveDerayById = catchAsync(async (req: Request, res: Response) => {
 const result = await aboutSteveDerayService.getAboutSteveDerayById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutSteveDeray fetched successfully',
    data: result,
  });

});
const updateAboutSteveDeray = catchAsync(async (req: Request, res: Response) => {
const result = await aboutSteveDerayService.updateAboutSteveDeray(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutSteveDeray updated successfully',
    data: result,
  });

});


const deleteAboutSteveDeray = catchAsync(async (req: Request, res: Response) => {
 const result = await aboutSteveDerayService.deleteAboutSteveDeray(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutSteveDeray deleted successfully',
    data: result,
  });

});

export const aboutSteveDerayController = {
  createAboutSteveDeray,
  getAllAboutSteveDeray,
  getAboutSteveDerayById,
  updateAboutSteveDeray,
  deleteAboutSteveDeray,
};