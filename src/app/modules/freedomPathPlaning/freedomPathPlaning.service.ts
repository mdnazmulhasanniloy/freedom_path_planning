/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

interface freedomPathPlaningPayload {
  id?: string;
  title: string;
  banner: string;
  key?: string;
  options?: {
    id?: string;
    title: string;
    subTitle: string;
  }[];
}

//Create Function
const createFreedomPathPlaning = async (payload: freedomPathPlaningPayload) => {
  const { options, ...data } = payload;
  const isExists = await prisma.freedomPathPlaning.findFirst({});
  if (!isExists) {
    const result = await prisma.freedomPathPlaning.create({
      data: {
        ...data,
        ...(options?.length && {
          options: {
            create: options.map(opt => ({
              title: opt.title,
              subTitle: opt.subTitle,
            })),
          },
        }),
      },
      include: { options: true },
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create freedomPathPlaning',
      );
    }

    return result;
  } else {
    const existing = await prisma.freedomPathPlaning.findUnique({
      where: { id: isExists.id },
      include: { options: true },
    });

    if (!existing) {
      throw new Error('Freedom path planing not found');
    }

    const existingOptionIds = existing.options.map(o => o.id);
    const payloadOptionIds = options?.filter(o => o.id).map(o => o.id!) ?? [];

    const deleteIds = existingOptionIds.filter(
      optionId => !payloadOptionIds.includes(optionId),
    );

    const result = await prisma.freedomPathPlaning.update({
      where: { id: isExists.id },
      data: {
        ...data,

        ...(options &&
          options.length > 0 && {
            options: {
              // 🗑️ DELETE
              ...(deleteIds.length > 0 && {
                deleteMany: {
                  id: { in: deleteIds },
                },
              }),

              // ✏️ UPDATE
              update: options
                .filter(o => o.id)
                .map(o => ({
                  where: { id: o.id! },
                  data: {
                    title: o.title,
                    subTitle: o.subTitle,
                  },
                })),

              // ➕ CREATE
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
  }
};

/*
get all function
*/
const getAllFreedomPathPlaning = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.freedomPathPlaningWhereInput = {};

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

  const orderBy: Prisma.freedomPathPlaningOrderByWithRelationInput[] = sort
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
    const data = await prisma.freedomPathPlaning.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { options: true },
    });

    const total = await prisma.freedomPathPlaning.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getFreedomPathPlaningById = async (id: string) => {
  try {
    const result = await prisma.freedomPathPlaning.findUnique({
      where: {
        id,
      },
      include: { options: true },
    });

    if (!result)
      throw new AppError(httpStatus.NOT_FOUND, 'FreedomPathPlaning not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateFreedomPathPlaning = async (
  id: string,
  payload: freedomPathPlaningPayload,
) => {
  const { options, ...data } = payload;

  const existing = await prisma.freedomPathPlaning.findUnique({
    where: { id },
    include: { options: true },
  });

  if (!existing) {
    throw new Error('Freedom path planing not found');
  }

  const existingOptionIds = existing.options.map(o => o.id);
  const payloadOptionIds = options?.filter(o => o.id).map(o => o.id!) ?? [];

  const deleteIds = existingOptionIds.filter(
    optionId => !payloadOptionIds.includes(optionId),
  );

  const result = await prisma.freedomPathPlaning.update({
    where: { id },
    data: {
      ...data,

      ...(options &&
        options.length > 0 && {
          options: {
            // 🗑️ DELETE
            ...(deleteIds.length > 0 && {
              deleteMany: {
                id: { in: deleteIds },
              },
            }),

            // ✏️ UPDATE
            update: options
              .filter(o => o.id)
              .map(o => ({
                where: { id: o.id! },
                data: {
                  title: o.title,
                  subTitle: o.subTitle,
                },
              })),

            // ➕ CREATE
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

const deleteFreedomPathPlaning = async (id: string) => {
  const result = await prisma.freedomPathPlaning.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete freedomPathPlaning',
    );

  return result;
};

export const freedomPathPlaningService = {
  createFreedomPathPlaning,
  getAllFreedomPathPlaning,
  getFreedomPathPlaningById,
  updateFreedomPathPlaning,
  deleteFreedomPathPlaning,
};
