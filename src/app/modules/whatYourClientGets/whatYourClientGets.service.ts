/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

interface WhatYourClientGetsPayload {
  image: string;
  key?: string;
  options?: {
    id?: string;
    title: string;
    subTitle: string;
  }[];
}

//Create Function
const createWhatYourClientGets = async (payload: WhatYourClientGetsPayload) => {
  const { options, ...data } = payload;
  const result = await prisma.whatYourClientGets.create({
    data: {
      ...data,
      ...(options && {
        options: {
          create: options,
        },
      }),
    },
    include: { options: true },
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create whatYourClientGets',
    );
  }
  return result;
};

/*
get all function
*/
const getAllWhatYourClientGets = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.WhatYourClientGetsWhereInput = {};

  /*
   * enter here search input filed
   */
  if (searchTerm) {
    where.OR = ['key'].map(field => ({
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

  const orderBy: Prisma.WhatYourClientGetsOrderByWithRelationInput[] = sort
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
    const data = await prisma.whatYourClientGets.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { options: true },
    });

    const total = await prisma.whatYourClientGets.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getWhatYourClientGetsById = async (id: string) => {
  try {
    const result = await prisma.whatYourClientGets.findUnique({
      where: {
        id,
      },
      include: { options: true },
    });

    if (!result) throw new Error('WhatYourClientGets not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateWhatYourClientGets = async (
  id: string,
  payload: WhatYourClientGetsPayload,
) => {
  const { options, ...data } = payload;

  // existing options from DB
  const existing = await prisma.whatYourClientGets.findUnique({
    where: { id },
    include: { options: true },
  });

  if (!existing) {
    throw new Error('WhatYourClientGets not found');
  }

  const existingOptionIds = existing.options.map(o => o.id);
  const payloadOptionIds = options?.filter(o => o.id).map(o => o.id!) || [];

  // options to delete
  const deleteIds = existingOptionIds.filter(
    id => !payloadOptionIds.includes(id),
  );

  const result = await prisma.whatYourClientGets.update({
    where: { id },
    data: {
      ...data,

      ...(options && {
        options: {
          // DELETE removed options
          deleteMany: {
            id: { in: deleteIds },
          },

          // UPDATE existing
          update: options
            .filter(o => o.id)
            .map(o => ({
              where: { id: o.id! },
              data: {
                title: o.title,
                subTitle: o.subTitle,
              },
            })),

          // CREATE new
          create: options
            .filter(o => !o.id)
            .map(o => ({
              title: o.title,
              subTitle: o.subTitle,
            })),
        },
      }),
    },
    include: { options: true },
  });

  return result;
};

const deleteWhatYourClientGets = async (id: string) => {
  try {
    const result = await prisma.whatYourClientGets.delete({
      where: {
        id,
      },
    });

    if (!result)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete whatYourClientGets',
      );

    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error?.message || 'Failed to delete whatYourClientGets',
    );
  }
};

export const whatYourClientGetsService = {
  createWhatYourClientGets,
  getAllWhatYourClientGets,
  getWhatYourClientGetsById,
  updateWhatYourClientGets,
  deleteWhatYourClientGets,
};
