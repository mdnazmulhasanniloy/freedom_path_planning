/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createBlogs = async (payload: Prisma.BlogCreateInput) => {
  const result = await prisma.blog.create({
    data: payload,
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create blog');
  }
  return result;
};

/*
get all function
*/
const getAllBlogs = async (query: Record<string, any>) => {
  query.isDeleted = false;
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.BlogWhereInput = {};

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

  const orderBy: Prisma.BlogOrderByWithRelationInput[] = sort
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
    const data = await prisma.blog.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.blog.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getBlogsById = async (id: string) => {
  try {
    const result = await prisma.blog.findUnique({
      where: {
        id,
      },
    });

    if (!result || result?.isDeleted) throw new Error('Blog not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const visitABlogs = async (id: string) => {
  const result = await prisma.blog.update({
    where: { id },
    data: {
      view: { increment: 1 },
    },
  });

  if (!result) throw new AppError(httpStatus.BAD_REQUEST, 'view blog failed');
  return result;
};

// update
const updateBlogs = async (id: string, payload: Prisma.BlogUpdateInput) => {
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update Blogs');

  return result;
};

const deleteBlogs = async (id: string) => {
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  if (!result)
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete blog');

  return result;
};

export const blogsService = {
  createBlogs,
  getAllBlogs,
  getBlogsById,
  updateBlogs,
  deleteBlogs,
  visitABlogs,
};
