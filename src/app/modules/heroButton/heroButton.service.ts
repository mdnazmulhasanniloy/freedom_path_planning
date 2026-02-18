
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status'; 


//Create Function
const createHeroButton = async (payload:Prisma.heroButtonCreateInput) => {
  const result = await prisma.heroButton.create({
      data: payload,
    });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create heroButton');
  }
  return result;
};

/*
get all function
*/
const getAllHeroButton = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

    const where: Prisma.heroButtonWhereInput = {};

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
  
    const orderBy: Prisma.heroButtonOrderByWithRelationInput[] = sort
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
    const data = await prisma.heroButton.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.heroButton.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }




};

const getHeroButtonById = async (id: string) => {

 try {
    const result = await prisma.heroButton.findUnique({
      where: {
        id,
      },
    });

     if (!result) 
    throw new AppError(httpStatus.NOT_FOUND, 'HeroButton not found!');
  

    return result;
  } catch (error: any)  {
   
  throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
   
};



// update 
const updateHeroButton = async (id: string, payload:Prisma.heroButtonUpdateInput ) => {
 const result = await prisma.heroButton.update({
      where: {
        id,
      },
      data: payload,
    });

    if (!result) 
      throw new Error('Failed to update HeroButton');
    

    return result; 
};

const deleteHeroButton = async (id: string) => {

 const result = await prisma.heroButton.delete({
      where: {
        id,
      }
    });

 
  if (!result) 
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete heroButton');
 
  return result;
};

export const heroButtonService = {
  createHeroButton,
  getAllHeroButton,
  getHeroButtonById,
  updateHeroButton,
  deleteHeroButton,
};