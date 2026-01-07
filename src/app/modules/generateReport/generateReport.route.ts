import { Router } from 'express';
import { generateReportController } from './generateReport.controller';

const router = Router();

router.post('/get-report', generateReportController.generateReport);

export const generateReportRoutes = router;
