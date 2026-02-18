/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import prisma from '@app/shared/prisma';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

const updateHomePageHeroSection = async (
  payload: Prisma.homePageHeroSectionCreateInput,
) => {
  const isExists = await prisma.homePageHeroSection.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.homePageHeroSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create homePageHeroSection',
      );
    }
    return result;
  }

  const result = await prisma.homePageHeroSection.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update homePageHeroSection');

  return result;
};
const getHomePageHeroSection = async () => {
  const result = await prisma.homePageHeroSection.findFirst({
    where: {},
  });

  if (!result) throw new Error('Failed to get homePageHeroSection');

  return result;
};

const updateHomePageServiceSection = async (
  payload: Prisma.homePageServiceSectionCreateInput,
) => {
  const isExists = await prisma.homePageServiceSection.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.homePageServiceSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create homePageServiceSection',
      );
    }
    return result;
  }

  const result = await prisma.homePageServiceSection.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update homePageServiceSection');

  return result;
};
const getHomePageServiceSection = async () => {
  const result = await prisma.homePageServiceSection.findFirst({
    where: {},
  });

  if (!result) throw new Error('Failed to get homePageServiceSection');

  return result;
};

const updateServiceDetailsPageWhatsIncludedSection = async (
  payload: Prisma.serviceDetailsPageWhatsIncludedSectionCreateInput,
) => {
  const isExists = await prisma.serviceDetailsPageWhatsIncludedSection.findMany(
    {
      where: {},
    },
  );

  if (isExists?.length === 0) {
    const result = await prisma.serviceDetailsPageWhatsIncludedSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create service details page whats included section',
      );
    }
    return result;
  }

  const result = await prisma.serviceDetailsPageWhatsIncludedSection.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result)
    throw new Error(
      'Failed to update service details page whats included section',
    );

  return result;
};
const getServiceDetailsPageWhatsIncludedSection = async () => {
  const result = await prisma.serviceDetailsPageWhatsIncludedSection.findFirst({
    where: {},
  });

  if (!result)
    throw new Error(
      'Failed to get service details page whats included section',
    );

  return result;
};

const updateServiceDetailsPageBlogSection = async (
  payload: Prisma.serviceDetailsPageBlogSectionCreateInput,
) => {
  const isExists = await prisma.serviceDetailsPageBlogSection.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.serviceDetailsPageBlogSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create service details page blog section',
      );
    }
    return result;
  }

  const result = await prisma.serviceDetailsPageBlogSection.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result)
    throw new Error('Failed to update service details page blog section');

  return result;
};
const getServiceDetailsPageBlogSection = async () => {
  const result = await prisma.serviceDetailsPageBlogSection.findFirst({
    where: {},
  });

  if (!result)
    throw new Error('Failed to get service details page blog section');

  return result;
};

const updateResourcesSection = async (
  payload: Prisma.resourcesSectionCreateInput,
) => {
  const isExists = await prisma.resourcesSection.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.resourcesSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create resources section',
      );
    }
    return result;
  }

  const result = await prisma.resourcesSection.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update resources section');

  return result;
};
const getResourcesSection = async () => {
  const result = await prisma.resourcesSection.findFirst({
    where: {},
  });

  if (!result) throw new Error('Failed to get resources section');

  return result;
};

const updateResourcesPage = async (
  payload: Prisma.resourcesPageCreateInput,
) => {
  const isExists = await prisma.resourcesPage.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.resourcesPage.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create resources page',
      );
    }
    return result;
  }

  const result = await prisma.resourcesPage.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update resources page');

  return result;
};
const getResourcesPage = async () => {
  const result = await prisma.resourcesPage.findFirst({
    where: {},
  });

  if (!result) throw new Error('Failed to get resources page');

  return result;
};

const updateLearnAndGrowWithOurBooksSection = async (
  payload: Prisma.learnAndGrowWithOurBooksSectionCreateInput,
) => {
  const isExists = await prisma.learnAndGrowWithOurBooksSection.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.learnAndGrowWithOurBooksSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create learn and grow with our books section',
      );
    }
    return result;
  }

  const result = await prisma.learnAndGrowWithOurBooksSection.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result)
    throw new Error('Failed to update learn and grow with our books section');

  return result;
};
const getLearnAndGrowWithOurBooksSection = async () => {
  const result = await prisma.learnAndGrowWithOurBooksSection.findFirst({
    where: {},
  });

  if (!result)
    throw new Error('Failed to get learn and grow with our books section');

  return result;
};

const updateTestimonialSection = async (
  payload: Prisma.testimonialSectionCreateInput,
) => {
  const isExists = await prisma.testimonialSection.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.testimonialSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create testimonial section',
      );
    }
    return result;
  }

  const result = await prisma.testimonialSection.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update testimonial section');

  return result;
};
const getTestimonialSection = async () => {
  const result = await prisma.testimonialSection.findFirst({
    where: {},
  });

  if (!result) throw new Error('Failed to get testimonial section');

  return result;
};

export const homePageContentsService = {
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
