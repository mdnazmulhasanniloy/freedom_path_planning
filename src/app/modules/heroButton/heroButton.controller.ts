

import catchAsync from '@app/utils/catchAsync';
import { heroButtonService } from './heroButton.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createHeroButton = catchAsync(async (req: Request, res: Response) => {
 const result = await heroButtonService.createHeroButton(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'HeroButton created successfully',
    data: result,
  });

});

const getAllHeroButton = catchAsync(async (req: Request, res: Response) => {

 const result = await heroButtonService.getAllHeroButton(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All heroButton fetched successfully',
    data: result,
  });

});

const getHeroButtonById = catchAsync(async (req: Request, res: Response) => {
 const result = await heroButtonService.getHeroButtonById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'HeroButton fetched successfully',
    data: result,
  });

});
const updateHeroButton = catchAsync(async (req: Request, res: Response) => {
const result = await heroButtonService.updateHeroButton(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'HeroButton updated successfully',
    data: result,
  });

});


const deleteHeroButton = catchAsync(async (req: Request, res: Response) => {
 const result = await heroButtonService.deleteHeroButton(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'HeroButton deleted successfully',
    data: result,
  });

});

export const heroButtonController = {
  createHeroButton,
  getAllHeroButton,
  getHeroButtonById,
  updateHeroButton,
  deleteHeroButton,
};