import { Router } from 'express';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.get('/cards', dashboardController.dashboardCards);
router.get('/chart', dashboardController.dashboardChart);
router.get('/services', dashboardController.serviceList);

export const dashboardRoutes = router;
