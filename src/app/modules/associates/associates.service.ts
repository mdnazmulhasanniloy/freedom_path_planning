/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createAssociates = async (payload: Prisma.AssociatesCreateInput) => {
  const result = await prisma.associates.create({
    data: payload,
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create associates');
  }
  return result;
};

/*
get all function
*/
const getAllAssociates = async (query: Record<string, any>) => {
  query.isDeleted = false;
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.AssociatesWhereInput = {};

  /*
   * enter here search input filed
   */
  if (searchTerm) {
    where.OR = [].map(field => ({
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

  const orderBy: Prisma.AssociatesOrderByWithRelationInput[] = sort
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
    const data = await prisma.associates.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.associates.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getAssociatesById = async (id: string) => {
  const result = await prisma.associates.findUnique({
    where: {
      id,
    },
  });

  if (!result || result?.isDeleted) throw new Error('Associates not found!');

  return result;
};

// update
const updateAssociates = async (
  id: string,
  payload: Prisma.AssociatesUpdateInput,
) => {
  const result = await prisma.associates.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update Associates');

  return result;
};

const deleteAssociates = async (id: string) => {
  const result = await prisma.associates.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  if (!result)
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete associates');

  return result;
};

export const associatesService = {
  createAssociates,
  getAllAssociates,
  getAssociatesById,
  updateAssociates,
  deleteAssociates,
};
