

import catchAsync from '@app/utils/catchAsync';
import { downloadsBookService } from './downloadsBook.service'; 
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';


const createDownloadsBook = catchAsync(async (req: Request, res: Response) => {
 const result = await downloadsBookService.createDownloadsBook(req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBook created successfully',
    data: result,
  });

});

const getAllDownloadsBook = catchAsync(async (req: Request, res: Response) => {

 const result = await downloadsBookService.getAllDownloadsBook(req.query);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'All downloadsBook fetched successfully',
    data: result,
  });

});

const getDownloadsBookById = catchAsync(async (req: Request, res: Response) => {
 const result = await downloadsBookService.getDownloadsBookById(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBook fetched successfully',
    data: result,
  });

});
const updateDownloadsBook = catchAsync(async (req: Request, res: Response) => {
const result = await downloadsBookService.updateDownloadsBook(req.params.id, req.body);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBook updated successfully',
    data: result,
  });

});


const deleteDownloadsBook = catchAsync(async (req: Request, res: Response) => {
 const result = await downloadsBookService.deleteDownloadsBook(req.params.id);
  sendResponse(res, {
   statusCode: httpStatus.OK,
    success: true,
    message: 'DownloadsBook deleted successfully',
    data: result,
  });

});

export const downloadsBookController = {
  createDownloadsBook,
  getAllDownloadsBook,
  getDownloadsBookById,
  updateDownloadsBook,
  deleteDownloadsBook,
};