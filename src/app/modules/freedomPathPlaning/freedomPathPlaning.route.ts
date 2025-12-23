import { Router } from 'express';
import { freedomPathPlaningController } from './freedomPathPlaning.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import parseData from '@app/middleware/parseData';
import uploadSingle from '@app/middleware/uploadSingle';
import multer, { memoryStorage } from 'multer';

const router = Router();
const uploads = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('banner'),
  parseData(),
  uploadSingle('banner'),
  freedomPathPlaningController.createFreedomPathPlaning,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('banner'),
  parseData(),
  uploadSingle('banner'),
  freedomPathPlaningController.updateFreedomPathPlaning,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  freedomPathPlaningController.deleteFreedomPathPlaning,
);
router.get('/:id', freedomPathPlaningController.getFreedomPathPlaningById);
router.get('/', freedomPathPlaningController.getAllFreedomPathPlaning);

export const freedomPathPlaningRoutes = router;
