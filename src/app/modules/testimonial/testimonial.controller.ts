import catchAsync from '@app/utils/catchAsync';
import { testimonialService } from './testimonial.service';
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express'; 

const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialService.createTestimonial(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial created successfully',
    data: result,
  });
});

const getAllTestimonial = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialService.getAllTestimonial(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All testimonial fetched successfully',
    data: result,
  });
});

const getTestimonialById = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialService.getTestimonialById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial fetched successfully',
    data: result,
  });
});
const updateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialService.updateTestimonial(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial updated successfully',
    data: result,
  });
});

const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const result = await testimonialService.deleteTestimonial(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial deleted successfully',
    data: result,
  });
});

export const testimonialController = {
  createTestimonial,
  getAllTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
