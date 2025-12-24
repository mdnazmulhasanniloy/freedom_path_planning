/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@app/shared/prisma';
import { serviceService } from '../services/services.service';
import moment from 'moment';

//Create Function
const dashboardCards = async () => {
  const viewersData = await prisma.blog.aggregate({
    _sum: { view: true },
  });

  const downloadsData = await prisma.books.aggregate({
    _sum: { downloads: true },
  });

  const reportsData = await prisma.reportGenerate.aggregate({
    _count: { id: true },
  });

  return {
    totalViewers: viewersData?._sum?.view || 0,
    totalDownloads: downloadsData?._sum?.downloads || 0,
    totalReports: reportsData?._count?.id || 0,
  };
};

const serviceLIst = async (query: Record<string, any>) => {
  const result = await serviceService.getAllService(query);
  return result;
};

const dashboardChart = async (query: Record<string, any>) => {
  const year = query.year ? Number(query.year) : moment().year();

  const start = moment().year(year).startOf('year').toDate();
  const end = moment().year(year).endOf('year').toDate();

  const reports = await prisma.reportGenerate.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  // create array for 12 months — all start at 0
  const monthlyData = Array(12).fill(0);

  reports.forEach(report => {
    const monthIndex = moment(report.createdAt).month(); // 0–11
    monthlyData[monthIndex] += 1;
  });

  return monthlyData.map((total, i) => ({
    month: i + 1, // 1–12
    total,
  }));
};

export const dashboardService = {
  dashboardCards,
  serviceLIst,
  dashboardChart,
};
