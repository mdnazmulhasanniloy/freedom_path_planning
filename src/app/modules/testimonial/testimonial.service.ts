
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status'; 


//Create Function
const createTestimonial = async (payload:Prisma.TestimonialCreateInput) => {
  const result = await prisma.testimonial.create({
      data: payload,
    });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create testimonial');
  }
  return result;
};

/*
get all function
*/
const getAllTestimonial = async (query: Record<string, any>) => {
 query.isDeleted = false;
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

    const where: Prisma.TestimonialWhereInput = {};

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
  
    const orderBy: Prisma.TestimonialOrderByWithRelationInput[] = sort
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
    const data = await prisma.testimonial.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.testimonial.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }




};

const getTestimonialById = async (id: string) => {

 try {
    const result = await prisma.testimonial.findUnique({
      where: {
        id,
      },
    });

     if (!result || result?.isDeleted) 
    throw new Error('Testimonial not found!');
  

    return result;
  } catch (error: any)  {
   
  throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
   
};



// update 
const updateTestimonial = async (id: string, payload:Prisma.TestimonialUpdateInput ) => {
 const result = await prisma.testimonial.update({
      where: {
        id,
      },
      data: payload,
    });

    if (!result) 
      throw new Error('Failed to update Testimonial');
    

    return result; 
};

const deleteTestimonial = async (id: string) => {

 const result = await prisma.testimonial.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

 
  if (!result) 
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete testimonial');
 
  return result;
};

export const testimonialService = {
  createTestimonial,
  getAllTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};