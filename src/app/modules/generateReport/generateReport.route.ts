import { Router } from 'express';
import { generateReportController } from './generateReport.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';

const router = Router();

router.post('/get-report', generateReportController.generateReport);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  generateReportController.getAllReports,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  generateReportController.getSingleReport,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin),
  generateReportController.deleteReport,
);

export const generateReportRoutes = router;
