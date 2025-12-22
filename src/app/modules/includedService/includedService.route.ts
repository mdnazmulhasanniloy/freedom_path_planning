import { Router } from 'express';
import { includedServiceController } from './includedService.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  includedServiceController.createIncludedService,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  includedServiceController.updateIncludedService,
);
router.delete('/:id', includedServiceController.deleteIncludedService);
router.get('/:id', includedServiceController.getIncludedServiceById);
router.get('/', includedServiceController.getAllIncludedService);

export const includedServiceRoutes = router;
