

import catchAsync from '@app/utils/catchAsync';
import { blogsService } from './blogs.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createBlogs = catchAsync(async (req: Request, res: Response) => {
 const result = await blogsService.createBlogs(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs created successfully',
    data: result,
  });

});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {

 const result = await blogsService.getAllBlogs(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All blogs fetched successfully',
    data: result,
  });

});

const getBlogsById = catchAsync(async (req: Request, res: Response) => {
 const result = await blogsService.getBlogsById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs fetched successfully',
    data: result,
  });

});
const updateBlogs = catchAsync(async (req: Request, res: Response) => {
const result = await blogsService.updateBlogs(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs updated successfully',
    data: result,
  });

});


const deleteBlogs = catchAsync(async (req: Request, res: Response) => {
 const result = await blogsService.deleteBlogs(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs deleted successfully',
    data: result,
  });

});

export const blogsController = {
  createBlogs,
  getAllBlogs,
  getBlogsById,
  updateBlogs,
  deleteBlogs,
};