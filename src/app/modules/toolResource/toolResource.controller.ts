

import catchAsync from '@app/utils/catchAsync';
import { toolResourceService } from './toolResource.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createToolResource = catchAsync(async (req: Request, res: Response) => {
 const result = await toolResourceService.createToolResource(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'ToolResource created successfully',
    data: result,
  });

});

const getAllToolResource = catchAsync(async (req: Request, res: Response) => {

 const result = await toolResourceService.getAllToolResource(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All toolResource fetched successfully',
    data: result,
  });

});

const getToolResourceById = catchAsync(async (req: Request, res: Response) => {
 const result = await toolResourceService.getToolResourceById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'ToolResource fetched successfully',
    data: result,
  });

});
const updateToolResource = catchAsync(async (req: Request, res: Response) => {
const result = await toolResourceService.updateToolResource(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'ToolResource updated successfully',
    data: result,
  });

});


const deleteToolResource = catchAsync(async (req: Request, res: Response) => {
 const result = await toolResourceService.deleteToolResource(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'ToolResource deleted successfully',
    data: result,
  });

});

export const toolResourceController = {
  createToolResource,
  getAllToolResource,
  getToolResourceById,
  updateToolResource,
  deleteToolResource,
};