/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '@app/error/AppError';
import { paginationHelper } from '@app/helpers/pagination.helpers';
import prisma from '@app/shared/prisma';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import httpStatus from 'http-status';

const createService = async (payload: any) => {
  try {
    const {
      whatYourClientGets,
      includedServices,
      clientGetsImage,
      image,
      ...serviceData
    } = payload;
    if (image?.length > 0) serviceData['image'] = image[0];

    const result = await prisma.service.create({
      data: {
        ...serviceData,

        // Included services
        includedServices: includedServices?.length
          ? {
              create: includedServices.map((item: any) => ({
                title: item.title,
                subTitle: item.subTitle,
              })),
            }
          : undefined,

        // What your client gets + options
        whatYourClientGets: whatYourClientGets
          ? {
              create: {
                image: clientGetsImage[0],
                options: {
                  create: whatYourClientGets.options?.map((opt: any) => ({
                    title: opt.title,
                    subTitle: opt.subTitle,
                  })),
                },
              },
            }
          : undefined,
      },

      include: {
        includedServices: true,
        whatYourClientGets: {
          include: {
            options: true,
          },
        },
      },
    });

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const updateService = async (serviceId: string, payload: any) => {
  try {
    const {
      whatYourClientGets,
      includedServices,
      clientGetsImage,
      image,
      ...serviceData
    } = payload;

    const isExist = await prisma.service.findUnique({
      where: {
        id: serviceId,
      },

      include: {
        whatYourClientGets: {
          include: {
            options: true,
          },
        },

        includedServices: true,
      },
    });

    if (!isExist)
      throw new AppError(httpStatus.BAD_REQUEST, 'service are not found!');

    const existingIncludedServiceIds = isExist.includedServices.map(o => o.id);
    const payloadIncludedServiceIds =
      includedServices?.filter((o: any) => o.id).map((o: any) => o.id!) || [];

    // includedService to delete
    const deleteIncludedServiceIds = existingIncludedServiceIds.filter(
      id => !payloadIncludedServiceIds.includes(id),
    );

    /* ==============================
       WHAT YOUR CLIENT GETS
    ============================== */
    const existingClientGets = isExist.whatYourClientGets;
    const existingOptionIds = existingClientGets?.options.map(o => o.id) || [];
    const payloadOptionIds =
      whatYourClientGets?.options
        ?.filter((o: any) => o.id)
        .map((o: any) => o.id) || [];

    const deleteOptionIds = existingOptionIds.filter(
      id => !payloadOptionIds.includes(id),
    );

    const result = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: {
        ...serviceData,
        ...(image?.length > 0 && { image: image[0] }),

        ...(includedServices && {
          includedServices: {
            deleteMany: {
              id: {
                in: deleteIncludedServiceIds,
              },
            },

            update: includedServices
              .filter((o: any) => o.id)
              .map((o: any) => ({
                where: { id: o.id! },
                data: {
                  title: o.title,
                  subTitle: o.subTitle,
                },
              })),

            create: includedServices
              .filter((o: any) => !o.id)
              .map((o: any) => ({
                title: o.title,
                subTitle: o.subTitle,
              })),
          },
        }),

        ...(whatYourClientGets && {
          whatYourClientGets: existingClientGets
            ? {
                update: {
                  ...(clientGetsImage?.length > 0 && {
                    image: clientGetsImage[0],
                  }),

                  options: {
                    deleteMany: {
                      id: { in: deleteOptionIds },
                    },

                    update: whatYourClientGets.options
                      ?.filter((o: any) => o.id)
                      .map((o: any) => ({
                        where: { id: o.id },
                        data: {
                          title: o.title,
                          subTitle: o.subTitle,
                        },
                      })),

                    create: whatYourClientGets.options
                      ?.filter((o: any) => !o.id)
                      .map((o: any) => ({
                        title: o.title,
                        subTitle: o.subTitle,
                      })),
                  },
                },
              }
            : {
                create: {
                  ...(clientGetsImage?.length > 0 && {
                    image: clientGetsImage[0],
                  }),

                  options: {
                    create: whatYourClientGets.options?.map((o: any) => ({
                      title: o.title,
                      subTitle: o.subTitle,
                    })),
                  },
                },
              },
        }),
      },

      include: {
        includedServices: true,
        whatYourClientGets: {
          include: {
            options: true,
          },
        },
      },
    });
    return result;
  } catch (error: any) {
    console.error('🚀 updateService error:', error);
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

// const updateService = async (
//   id: string,
//   payload: Prisma.ServiceUpdateInput,
// ) => {
//   try {
//     const result = await prisma.service.update({
//       where: {
//         id,
//       },
//       data: payload,
//     });

//     if (!result) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Service update failed!');
//     }

//     return result;
//   } catch (error: any) {
//     throw new AppError(httpStatus.BAD_REQUEST, error?.message);
//   }
// };

const getServiceById = async (id: string) => {
  try {
    const result = await prisma.service.findUnique({
      where: {
        id,
      },

      include: {
        whatYourClientGets: {
          include: {
            options: true,
          },
        },

        includedServices: true,
      },
    });

    if (!result || result?.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Service update failed!');
    }

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const getAllService = async (query: Record<string, any>) => {
  query.isDeleted = false;
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.ServiceWhereInput = {};

  // Search condition
  if (searchTerm) {
    where.OR = ['subTitle', 'subTitle', 'serviceName'].map(field => ({
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
  console.log(sort);

  const orderBy: Prisma.ServiceOrderByWithRelationInput[] = sort
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
    const data = await prisma.service.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        whatYourClientGets: {
          include: {
            options: true,
          },
        },

        includedServices: true,
      },
    });

    const total = await prisma.service.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

const deleteService = async (id: string) => {
  try {
    const result = await prisma.service.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error?.message);
  }
};

export const serviceService = {
  createService,
  updateService,
  getAllService,
  getServiceById,
  deleteService,
};
