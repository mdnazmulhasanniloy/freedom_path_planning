import catchAsync from '@app/utils/catchAsync';
import { contactUsPageContentsService } from './contactUsPageContents.service';
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { uploadToS3 } from '@app/utils/s3';

const updateContactUsContents = catchAsync(
  async (req: Request, res: Response) => {
    if (req?.file) {
      req.body.banner = await uploadToS3({
        file: req.file,
        fileName: `images/contactus/content/${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }

    const result = await contactUsPageContentsService.updateContactUsContents(
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'ContactUsPageContents updated successfully',
      data: result,
    });
  },
);
const getContactUsContents = catchAsync(async (req: Request, res: Response) => {
  const result = await contactUsPageContentsService.getContactUsContents();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ContactUsPageContents retrieved successfully',
    data: result,
  });
});

export const contactUsPageContentsController = {
  updateContactUsContents,
  getContactUsContents,
};
