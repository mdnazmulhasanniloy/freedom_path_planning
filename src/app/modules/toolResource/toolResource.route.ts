import { Router } from 'express';
import { toolResourceController } from './toolResource.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  toolResourceController.createToolResource,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  toolResourceController.updateToolResource,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  toolResourceController.deleteToolResource,
);
router.get('/:id', toolResourceController.getToolResourceById);
router.get('/', toolResourceController.getAllToolResource);

export const toolResourceRoutes = router;
