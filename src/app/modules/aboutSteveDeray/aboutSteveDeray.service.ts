/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createAboutSteveDeray = async (
  payload: Prisma.aboutSteveDerayCreateInput,
) => {
  const result = await prisma.aboutSteveDeray.create({
    data: payload,
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create aboutSteveDeray',
    );
  }
  return result;
};

/*
get all function
*/
const getAllAboutSteveDeray = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.aboutSteveDerayWhereInput = {};

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

  const orderBy: Prisma.aboutSteveDerayOrderByWithRelationInput[] = sort
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
    const data = await prisma.aboutSteveDeray.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.aboutSteveDeray.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getAboutSteveDerayById = async (id: string) => {
  try {
    const result = await prisma.aboutSteveDeray.findUnique({
      where: {
        id,
      },
    });

    if (!result) throw new Error('AboutSteveDeray not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateAboutSteveDeray = async (
  id: string,
  payload: Prisma.aboutSteveDerayUpdateInput,
) => {
  const result = await prisma.aboutSteveDeray.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update AboutSteveDeray',
    );

  return result;
};

const deleteAboutSteveDeray = async (id: string) => {
  const result = await prisma.aboutSteveDeray.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete aboutSteveDeray',
    );

  return result;
};

export const aboutSteveDerayService = {
  createAboutSteveDeray,
  getAllAboutSteveDeray,
  getAboutSteveDerayById,
  updateAboutSteveDeray,
  deleteAboutSteveDeray,
};
