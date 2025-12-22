/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createBookResources = async (
  payload: Prisma.BookResourcesCreateInput,
) => {
  const result = await prisma.bookResources.create({
    data: payload,
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create bookResources',
    );
  }
  return result;
};

/*
get all function
*/
const getAllBookResources = async (query: Record<string, any>) => {
  query.isDeleted = false;
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.BookResourcesWhereInput = {};

  /*
   * enter here search input filed
   */
  if (searchTerm) {
    where.OR = ['name'].map(field => ({
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

  const orderBy: Prisma.BookResourcesOrderByWithRelationInput[] = sort
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
    const data = await prisma.bookResources.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.bookResources.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getBookResourcesById = async (id: string) => {
  try {
    const result = await prisma.bookResources.findUnique({
      where: {
        id,
      },
    });

    if (!result || result?.isDeleted)
      throw new Error('BookResources not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateBookResources = async (
  id: string,
  payload: Prisma.BookResourcesUpdateInput,
) => {
  const result = await prisma.bookResources.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update BookResources');

  return result;
};

const deleteBookResources = async (id: string) => {
  const result = await prisma.bookResources.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete bookResources',
    );

  return result;
};

export const bookResourcesService = {
  createBookResources,
  getAllBookResources,
  getBookResourcesById,
  updateBookResources,
  deleteBookResources,
};
