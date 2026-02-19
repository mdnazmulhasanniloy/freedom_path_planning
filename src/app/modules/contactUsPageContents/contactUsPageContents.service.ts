/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError'; 
import prisma from '@app/shared/prisma'; 
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

const updateContactUsContents = async (
  payload: Prisma.contactUsPageContentsCreateInput,
) => {
  const isExists = await prisma.contactUsPageContents.findMany({
    where: {},
  });

  if (isExists?.length === 0) {
    const result = await prisma.contactUsPageContents.create({
      data: payload,
    });

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create contactUsPageContents',
      );
    }
    return result;
  }

  const result = await prisma.contactUsPageContents.update({
    where: {
      id: isExists[0].id,
    },
    data: payload,
  });

  if (!result) throw new Error('Failed to update contactUsPageContents');

  return result;
};
const getContactUsContents = async () => {
  const result = await prisma.contactUsPageContents.findFirst({
    where: {},
  });

  if (!result) throw new Error('Failed to get contactUsPageContents');

  return result;
};
export const contactUsPageContentsService = {
  updateContactUsContents,
  getContactUsContents,
};
