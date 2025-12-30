/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createDownloadsBook = async (
  payload: Prisma.DownloadsBookCreateInput,
) => {
  const result = await prisma.downloadsBook.create({
    data: payload,
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create downloadsBook',
    );
  }
  return result;
};

/*
get all function
*/
const getAllDownloadsBook = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.DownloadsBookWhereInput = {};

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

  const orderBy: Prisma.DownloadsBookOrderByWithRelationInput[] = sort
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
    const data = await prisma.downloadsBook.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        book: true,
      },
    });

    const total = await prisma.downloadsBook.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getDownloadsBookById = async (id: string) => {
  try {
    const result = await prisma.downloadsBook.findUnique({
      where: {
        id,
      },
      include: {
        book: true,
      },
    });

    if (!result) throw new Error('DownloadsBook not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateDownloadsBook = async (
  id: string,
  payload: Prisma.DownloadsBookUpdateInput,
) => {
  const result = await prisma.downloadsBook.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update DownloadsBook');

  return result;
};

const deleteDownloadsBook = async (id: string) => {
  const result = await prisma.downloadsBook.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete downloadsBook',
    );

  return result;
};

export const downloadsBookService = {
  createDownloadsBook,
  getAllDownloadsBook,
  getDownloadsBookById,
  updateDownloadsBook,
  deleteDownloadsBook,
};
