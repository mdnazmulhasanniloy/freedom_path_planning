import catchAsync from '@app/utils/catchAsync';
import { serviceService } from './services.service';
import sendResponse from '@app/utils/sendResponse';
import httpStatus from 'http-status';

const createService = catchAsync(async (req, res) => {
  const result = await serviceService.createService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'service create successfully',
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const result = await serviceService.updateService(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'service update successfully',
    data: result,
  });
});

const getAllService = catchAsync(async (req, res) => {
  const result = await serviceService.getAllService(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'all services fetch successfully',
    data: result,
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const result = await serviceService.getServiceById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'get single service successfully',
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const result = await serviceService.deleteService(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'service delete successfully',
    data: result,
  });
});

export const serviceController = {
  createService,
  updateService,
  getAllService,
  getServiceById,
  deleteService,
};
