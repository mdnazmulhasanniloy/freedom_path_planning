/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

const createService = async (payload: Prisma.ServiceCreateInput) => {
  try {
    const result = await prisma.service.create({
      data: payload,
    });
    if (!result)
      throw new AppError(httpStatus.BAD_REQUEST, 'service creation failed!');
    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const updateService = async (
  id: string,
  payload: Prisma.ServiceUpdateInput,
) => {
  try {
    const result = await prisma.service.update({
      where: {
        id,
      },
      data: payload,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Service update failed!');
    }

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getServiceById = async (id: string) => {
  try {
    const result = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!result || result?.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Service update failed!');
    }

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};
const getAllService = async (query: Record<string, any>) => {
  query.isDeleted = false;
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.ServiceWhereInput = {};

  // Search condition
  if (searchTerm) {
    where.OR = ['subTitle', 'subTitle', 'serviceName'].map(field => ({
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
  console.log(sort);

  const orderBy: Prisma.ServiceOrderByWithRelationInput[] = sort
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
    const data = await prisma.service.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.service.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const deleteService = async (id: string) => {
  try {
    const result = await prisma.service.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

export const serviceService = {
  createService,
  updateService,
  getAllService,
  getServiceById,
  deleteService,
};
