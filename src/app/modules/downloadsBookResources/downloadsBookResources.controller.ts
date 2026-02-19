

import catchAsync from '@app/utils/catchAsync'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { downloadsBookResourcesService } from './downloadsBookResources.service';


const createDownloadsBookResources = catchAsync(async (req: Request, res: Response) => {
 const result = await downloadsBookResourcesService.createDownloadsBookResources(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBookResources created successfully',
    data: result,
  });

});

const getAllDownloadsBookResources = catchAsync(async (req: Request, res: Response) => {

 const result = await downloadsBookResourcesService.getAllDownloadsBookResources(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All downloadsBookResources fetched successfully',
    data: result,
  });

});

const getDownloadsBookResourcesById = catchAsync(async (req: Request, res: Response) => {
 const result = await downloadsBookResourcesService.getDownloadsBookResourcesById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBookResources fetched successfully',
    data: result,
  });

});
const updateDownloadsBookResources = catchAsync(async (req: Request, res: Response) => {
const result = await downloadsBookResourcesService.updateDownloadsBookResources(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBookResources updated successfully',
    data: result,
  });

});


const deleteDownloadsBookResources = catchAsync(async (req: Request, res: Response) => {
 const result = await downloadsBookResourcesService.deleteDownloadsBookResources(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBookResources deleted successfully',
    data: result,
  });

});

export const downloadsBookResourcesController = {
  createDownloadsBookResources,
  getAllDownloadsBookResources,
  getDownloadsBookResourcesById,
  updateDownloadsBookResources,
  deleteDownloadsBookResources,
};