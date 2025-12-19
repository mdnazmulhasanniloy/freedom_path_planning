

import catchAsync from '@app/utils/catchAsync';
import { booksService } from './books.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createBooks = catchAsync(async (req: Request, res: Response) => {
 const result = await booksService.createBooks(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Books created successfully',
    data: result,
  });

});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {

 const result = await booksService.getAllBooks(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All books fetched successfully',
    data: result,
  });

});

const getBooksById = catchAsync(async (req: Request, res: Response) => {
 const result = await booksService.getBooksById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully',
    data: result,
  });

});
const updateBooks = catchAsync(async (req: Request, res: Response) => {
const result = await booksService.updateBooks(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Books updated successfully',
    data: result,
  });

});


const deleteBooks = catchAsync(async (req: Request, res: Response) => {
 const result = await booksService.deleteBooks(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'Books deleted successfully',
    data: result,
  });

});

export const booksController = {
  createBooks,
  getAllBooks,
  getBooksById,
  updateBooks,
  deleteBooks,
};