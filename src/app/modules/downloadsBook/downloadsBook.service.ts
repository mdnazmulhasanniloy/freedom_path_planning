/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import { sendEmail } from '@app/utils/mailSender';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';
import path from 'path';
import fs from 'fs';

//Create Function
const createDownloadsBook = async (
  payload: Prisma.DownloadsBooksCreateInput,
) => {
  const result = await prisma.downloadsBooks.create({
    data: payload,
    include: {
      book: true,
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create downloads books',
    );
  }

  const otpEmailPath = path.join(
    __dirname,
    '../../../../public/view/book_download.html',
  );

  await sendEmail(
    payload?.email,
    'support message',
    fs
      .readFileSync(otpEmailPath, 'utf8')
      .replace('{{username}}', result.username)
      .replace('{{email}}', result.email)
      .replace('{{company}}', payload?.company ? payload?.company : 'N/A')
      .replace('{{bookName}}', result.book.name),
  );

  return result;
};

/*
get all function
*/
const getAllDownloadsBook = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.DownloadsBooksWhereInput = {};

  /*
   * enter here search input filed
   */
  if (searchTerm) {
    where.OR = ['username'].map(field => ({
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

  const orderBy: Prisma.DownloadsBooksOrderByWithRelationInput[] = sort
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
    const data = await prisma.downloadsBooks.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        book: true,
      },
    });

    const total = await prisma.downloadsBooks.count({ where });

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
    const result = await prisma.downloadsBooks.findUnique({
      where: {
        id,
      },
      include: {
        book: true,
      },
    });

    if (!result) throw new Error('DownloadsBooks not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateDownloadsBook = async (
  id: string,
  payload: Prisma.DownloadsBooksUpdateInput,
) => {
  const result = await prisma.downloadsBooks.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update DownloadsBooks');

  return result;
};

const deleteDownloadsBook = async (id: string) => {
  const result = await prisma.downloadsBooks.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete downloadsBooks',
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
