

import catchAsync from '@app/utils/catchAsync';
import { aboutHeroSectionService } from './aboutHeroSection.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createAboutHeroSection = catchAsync(async (req: Request, res: Response) => {
 const result = await aboutHeroSectionService.createAboutHeroSection(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutHeroSection created successfully',
    data: result,
  });

});

const getAllAboutHeroSection = catchAsync(async (req: Request, res: Response) => {

 const result = await aboutHeroSectionService.getAllAboutHeroSection(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All aboutHeroSection fetched successfully',
    data: result,
  });

});

const getAboutHeroSectionById = catchAsync(async (req: Request, res: Response) => {
 const result = await aboutHeroSectionService.getAboutHeroSectionById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutHeroSection fetched successfully',
    data: result,
  });

});
const updateAboutHeroSection = catchAsync(async (req: Request, res: Response) => {
const result = await aboutHeroSectionService.updateAboutHeroSection(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutHeroSection updated successfully',
    data: result,
  });

});


const deleteAboutHeroSection = catchAsync(async (req: Request, res: Response) => {
 const result = await aboutHeroSectionService.deleteAboutHeroSection(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'AboutHeroSection deleted successfully',
    data: result,
  });

});

export const aboutHeroSectionController = {
  createAboutHeroSection,
  getAllAboutHeroSection,
  getAboutHeroSectionById,
  updateAboutHeroSection,
  deleteAboutHeroSection,
};