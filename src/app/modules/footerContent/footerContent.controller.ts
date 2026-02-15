

import catchAsync from '@app/utils/catchAsync';
import { footerContentService } from './footerContent.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createFooterContent = catchAsync(async (req: Request, res: Response) => {
 const result = await footerContentService.createFooterContent(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FooterContent created successfully',
    data: result,
  });

});

const getAllFooterContent = catchAsync(async (req: Request, res: Response) => {

 const result = await footerContentService.getAllFooterContent(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All footerContent fetched successfully',
    data: result,
  });

});

const getFooterContentById = catchAsync(async (req: Request, res: Response) => {
 const result = await footerContentService.getFooterContentById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FooterContent fetched successfully',
    data: result,
  });

});
const updateFooterContent = catchAsync(async (req: Request, res: Response) => {
const result = await footerContentService.updateFooterContent( req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FooterContent updated successfully',
    data: result,
  });

});


const deleteFooterContent = catchAsync(async (req: Request, res: Response) => {
 const result = await footerContentService.deleteFooterContent(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'FooterContent deleted successfully',
    data: result,
  });

});

export const footerContentController = {
  createFooterContent,
  getAllFooterContent,
  getFooterContentById,
  updateFooterContent,
  deleteFooterContent,
};