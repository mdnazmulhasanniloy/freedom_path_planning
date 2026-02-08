/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@app/shared/prisma';
import { IGenerateReport } from './generateReport.interface';
import fillFreedomPdf from './generateReport.utils';
import AppError from '@app/error/AppError';
import pickQuery from '@app/utils/pickQuery';
import { Prisma } from '@prisma/index';
import { paginationHelper } from '@app/helpers/pagination.helpers';

export const generateReport = async (payload: IGenerateReport) => {
  try {
    const pdf = await fillFreedomPdf(payload);
    const data = {
      name: payload.name,
      email: payload.email,
      pdf: pdf?.uploadSingle as string,
      pdfForUser: pdf?.uploadPage as string,
    }; 
    const result = await prisma.reportGenerate.create({
      data: data,
    });

    return result;
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Failed to generate report');
  }
};

const getAllReports = async (query: Record<string, any>) => {
  const { filters, pagination } = await pickQuery(query);
  const { searchTerm, ...filtersData } = filters;

  const where: Prisma.ReportGenerateWhereInput = {};

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

  const orderBy: Prisma.ReportGenerateOrderByWithRelationInput[] = sort
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
    const data = await prisma.reportGenerate.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const total = await prisma.reportGenerate.count({ where });

    return {
      data,
      meta: { page, limit, total },
    };
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Failed to fetch reports');
  }
};

const getSingleReport = async (id: string) => {
  try {
    const report = await prisma.reportGenerate.findUnique({
      where: { id },
    });

    return report;
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Failed to fetch report');
  }
};

const deleteReport = async (id: string) => {
  try {
    await prisma.reportGenerate.delete({
      where: { id },
    });
  } catch (error: any) {
    throw new AppError(500, error?.message || 'Failed to delete report');
  }
};

export const generateReportService = {
  generateReport,
  getAllReports,
  getSingleReport,
  deleteReport,
};
