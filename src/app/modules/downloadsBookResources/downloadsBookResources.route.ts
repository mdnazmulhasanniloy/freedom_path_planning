import { Router } from 'express';
import { downloadsBookResourcesController } from './downloadsBookResources.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';

const router = Router();

router.post('/', downloadsBookResourcesController.createDownloadsBookResources);
// router.patch(
//   '/:id',
//   auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
//   downloadsBookResourcesController.updateDownloadsBookResources,
// );
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  downloadsBookResourcesController.deleteDownloadsBookResources,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  downloadsBookResourcesController.getDownloadsBookResourcesById,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  downloadsBookResourcesController.getAllDownloadsBookResources,
);

export const downloadsBookResourcesRoutes = router;
