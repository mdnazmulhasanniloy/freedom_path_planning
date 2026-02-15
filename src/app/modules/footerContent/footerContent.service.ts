/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

//Create Function
const createFooterContent = async (
  payload: Prisma.FooterContentCreateInput,
) => {
  const result = await prisma.footerContent.create({
    data: payload,
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create footerContent',
    );
  }
  return result;
};

/*
get all function
*/
const getAllFooterContent = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.FooterContentWhereInput = {};

  /*
   * enter here search input filed
   */
  if (searchTerm) {
    where.OR = ['email'].map(field => ({
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

  const orderBy: Prisma.FooterContentOrderByWithRelationInput[] = sort
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
    const data = await prisma.footerContent.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.footerContent.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getFooterContentById = async (id: string) => {
  try {
    const result = await prisma.footerContent.findUnique({
      where: {
        id,
      },
    });

    if (!result) throw new Error('FooterContent not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateFooterContent = async (
  payload: Prisma.FooterContentUpdateInput | Prisma.FooterContentCreateInput,
) => {
  try {
    const isExists = await prisma.footerContent.findMany({
      where: {},
    });

    if (isExists?.length === 0) {
      return await createFooterContent(
        payload as Prisma.FooterContentCreateInput,
      );
    }

    const result = await prisma.footerContent.update({
      where: {
        id: isExists[0].id,
      },
      data: payload,
    });

    if (!result) throw new Error('Failed to update FooterContent');

    return result;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, (error as Error).message);
  }
};

const deleteFooterContent = async (id: string) => {
  const result = await prisma.footerContent.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete footerContent',
    );

  return result;
};

export const footerContentService = {
  createFooterContent,
  getAllFooterContent,
  getFooterContentById,
  updateFooterContent,
  deleteFooterContent,
};
