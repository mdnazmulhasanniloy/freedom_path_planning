/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createIncludedService = async (
  payload: Prisma.includedServiceCreateInput,
) => {
  const result = await prisma.includedService.create({
    data: payload,
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create includedService',
    );
  }
  return result;
};

/*
get all function
*/
const getAllIncludedService = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { ...filtersData } = filters;

  const where: Prisma.includedServiceWhereInput = {};

  /*
   * enter here search input filed
   */
  // if (searchTerm) {
  //   where.OR = ['title', 'subTitle'].map(field => ({
  //     [field]: {
  //       contains: searchTerm,
  //       mode: 'insensitive',
  //     },
  //   }));
  // }

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

  const orderBy: Prisma.includedServiceOrderByWithRelationInput[] = sort
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
    const data = await prisma.includedService.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.includedService.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getIncludedServiceById = async (id: string) => {
  try {
    const result = await prisma.includedService.findUnique({
      where: {
        id,
      },
    });

    if (!result) throw new Error('IncludedService not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateIncludedService = async (
  id: string,
  payload: Prisma.includedServiceUpdateInput,
) => {
  const result = await prisma.includedService.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update IncludedService');

  return result;
};

const deleteIncludedService = async (id: string) => {
  const result = await prisma.includedService.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete includedService',
    );

  return result;
};

export const includedServiceService = {
  createIncludedService,
  getAllIncludedService,
  getIncludedServiceById,
  updateIncludedService,
  deleteIncludedService,
};
