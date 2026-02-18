import catchAsync from '@app/utils/catchAsync';
import { homePageContentsService } from './homePageContents.service';
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { uploadToS3 } from '@app/utils/s3';

const updateHomePageHeroSection = catchAsync(
  async (req: Request, res: Response) => {
    if (req?.file) {
      req.body.heroImg = await uploadToS3({
        file: req.file,
        fileName: `images/homepage/content/${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }

    const result = await homePageContentsService.updateHomePageHeroSection(
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Home page hero section updated successfully',
      data: result,
    });
  },
);
const getHomePageHeroSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await homePageContentsService.getHomePageHeroSection();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Home page hero section retrieved successfully',
      data: result,
    });
  },
);

const updateHomePageServiceSection = catchAsync(
  async (req: Request, res: Response) => {
    if (req?.file) {
      req.body.servicePageImg = await uploadToS3({
        file: req.file,
        fileName: `images/homepage/content/${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }

    const result = await homePageContentsService.updateHomePageServiceSection(
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Home page service section updated successfully',
      data: result,
    });
  },
);
const getHomePageServiceSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await homePageContentsService.getHomePageServiceSection();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Home page service section retrieved successfully',
      data: result,
    });
  },
);

const updateServiceDetailsPageWhatsIncludedSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await homePageContentsService.updateServiceDetailsPageWhatsIncludedSection(
        req.body,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        'Service details page whats included section updated successfully',
      data: result,
    });
  },
);
const getServiceDetailsPageWhatsIncludedSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await homePageContentsService.getServiceDetailsPageWhatsIncludedSection();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        'Service details page whats included section retrieved successfully',
      data: result,
    });
  },
);

const updateServiceDetailsPageBlogSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await homePageContentsService.updateServiceDetailsPageBlogSection(
        req.body,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Service details page blog section updated successfully',
      data: result,
    });
  },
);
const getServiceDetailsPageBlogSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await homePageContentsService.getServiceDetailsPageBlogSection();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Service details page blog section retrieved successfully',
      data: result,
    });
  },
);

const updateResourcesSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await homePageContentsService.updateResourcesSection(
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Resources section updated successfully',
      data: result,
    });
  },
);
const getResourcesSection = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageContentsService.getResourcesSection();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resources section retrieved successfully',
    data: result,
  });
});

const updateResourcesPage = catchAsync(async (req: Request, res: Response) => {
  if (req?.file) {
    req.body.image = await uploadToS3({
      file: req.file,
      fileName: `images/resourcepage/content/${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }

  const result = await homePageContentsService.updateResourcesPage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resources page updated successfully',
    data: result,
  });
});
const getResourcesPage = catchAsync(async (req: Request, res: Response) => {
  const result = await homePageContentsService.getResourcesPage();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Resources page retrieved successfully',
    data: result,
  });
});

const updateLearnAndGrowWithOurBooksSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await homePageContentsService.updateLearnAndGrowWithOurBooksSection(
        req.body,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Learn and grow with our books section updated successfully',
      data: result,
    });
  },
);
const getLearnAndGrowWithOurBooksSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await homePageContentsService.getLearnAndGrowWithOurBooksSection();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Learn and grow with our books section retrieved successfully',
      data: result,
    });
  },
);

const updateTestimonialSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await homePageContentsService.updateTestimonialSection(
      req.body,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Testimonial section updated successfully',
      data: result,
    });
  },
);
const getTestimonialSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await homePageContentsService.getTestimonialSection();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Testimonial section retrieved successfully',
      data: result,
    });
  },
);

export const homePageContentsController = {
  updateHomePageHeroSection,
  getHomePageHeroSection,
  updateHomePageServiceSection,
  getHomePageServiceSection,
  updateServiceDetailsPageWhatsIncludedSection,
  getServiceDetailsPageWhatsIncludedSection,
  updateServiceDetailsPageBlogSection,
  getServiceDetailsPageBlogSection,
  updateResourcesSection,
  getResourcesSection,
  updateResourcesPage,
  getResourcesPage,
  updateLearnAndGrowWithOurBooksSection,
  getLearnAndGrowWithOurBooksSection,
  updateTestimonialSection,
  getTestimonialSection,
};
