import { Router } from 'express';
import { aboutSteveDerayController } from './aboutSteveDeray.controller';
import auth from '@app/middleware/auth';
import multer, { memoryStorage } from 'multer';
import { USER_ROLE } from '../users/user.constants';
import parseData from '@app/middleware/parseData';
import uploadSingle from '@app/middleware/uploadSingle';

const router = Router();
const uploads = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('banner'),
  parseData(),
  uploadSingle('banner'),
  aboutSteveDerayController.createAboutSteveDeray,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('banner'),
  parseData(),
  uploadSingle('banner'),
  aboutSteveDerayController.updateAboutSteveDeray,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  aboutSteveDerayController.deleteAboutSteveDeray,
);
router.get('/:id', aboutSteveDerayController.getAboutSteveDerayById);
router.get('/', aboutSteveDerayController.getAllAboutSteveDeray);

export const aboutSteveDerayRoutes = router;
