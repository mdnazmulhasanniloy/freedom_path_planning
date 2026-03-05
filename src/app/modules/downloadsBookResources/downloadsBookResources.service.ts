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
const createDownloadsBookResources = async (
  payload: Prisma.DownloadsBookResourcesCreateInput,
) => {
  const result = await prisma.downloadsBookResources.create({
    data: payload,
    include: {
      book: true,
    },
  });

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create downloads resources book',
    );
  }

  const otpEmailPath = path.join(
    __dirname,
    '../../../../public/view/e_book_download.html',
  );
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!admin)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'server internal error: admin mail not found',
    );
  await sendEmail(
    admin?.email,
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
const getAllDownloadsBookResources = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.DownloadsBookResourcesWhereInput = {};

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

  const orderBy: Prisma.DownloadsBookResourcesOrderByWithRelationInput[] = sort
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
    const data = await prisma.downloadsBookResources.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        book: true,
      },
    });

    const total = await prisma.downloadsBookResources.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getDownloadsBookResourcesById = async (id: string) => {
  try {
    const result = await prisma.downloadsBookResources.findUnique({
      where: {
        id,
      },
      include: {
        book: true,
      },
    });

    if (!result) throw new Error('DownloadsBookResources not found!');

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

// update
const updateDownloadsBookResources = async (
  id: string,
  payload: Prisma.DownloadsBookResourcesUpdateInput,
) => {
  const result = await prisma.downloadsBookResources.update({
    where: {
      id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update DownloadsBookResources');

  return result;
};

const deleteDownloadsBookResources = async (id: string) => {
  const result = await prisma.downloadsBookResources.delete({
    where: {
      id,
    },
  });

  if (!result)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete downloadsBookResources',
    );

  return result;
};

export const downloadsBookResourcesService = {
  createDownloadsBookResources,
  getAllDownloadsBookResources,
  getDownloadsBookResourcesById,
  updateDownloadsBookResources,
  deleteDownloadsBookResources,
};
