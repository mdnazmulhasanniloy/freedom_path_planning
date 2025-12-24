/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createAboutHeroSection = async (
  payload: Prisma.aboutHeroSectionCreateInput,
) => {
  const isExists = await prisma.aboutHeroSection.findFirst({});
  if (!isExists) {
    const result = await prisma.aboutHeroSection.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create aboutHeroSection',
      );
    }
    return result;
  } else {
    const result = await updateAboutHeroSection(isExists.id, payload);
    return result;
  }
};

/*
get all function
*/
const getAllAboutHeroSection = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.aboutHeroSectionWhereInput = {};

  /*
   * enter here search input filed
   */
  if (searchTerm) {
    where.OR = ['title'].map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    }));
  }

  // Filter conditions
  if (Object.keys(filtersData).length > 0) {
    const oldAnd = where.AND;
    const andArray = Array.isArray(oldAnd) ? oldAnd : oldAnd ? [oldAnd] : [];

    where.AND = [
      ...andArray,
      ...Object.entries(filtersData).map(([key, value]) => ({
        [key]: { equals: value },
      })),
    ];
  }

  // Pagination & Sorting
  const { page, limit, skip, sort } =
    paginationHelper.calculatePagination(pagination);

  const orderBy: Prisma.aboutHeroSectionOrderByWithRelationInput[] = sort
    ? sort.split(',').map(field => {
        const trimmed = field.trim();
        if (trimmed.startsWith('-')) {
          return { [trimmed.slice(1)]: 'desc' };
        }
        return { [trimmed]: 'asc' };
      })
    : [];

  try {
    // Fetch data
    const data = await prisma.aboutHeroSection.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.aboutHeroSection.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getAboutHeroSectionById = async (id: string) => {
  try {
    const result = await prisma.aboutHeroSection.findUnique({
      where: {
        id,
      },
    });

    if (!result) throw new Error('AboutHeroSection not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateAboutHeroSection = async (
  id: string,
  payload: Prisma.aboutHeroSectionUpdateInput,
) => {
  const result = await prisma.aboutHeroSection.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update AboutHeroSection');

  return result;
};

const deleteAboutHeroSection = async (id: string) => {
  const result = await prisma.aboutHeroSection.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete aboutHeroSection',
    );

  return result;
};

export const aboutHeroSectionService = {
  createAboutHeroSection,
  getAllAboutHeroSection,
  getAboutHeroSectionById,
  updateAboutHeroSection,
  deleteAboutHeroSection,
};
