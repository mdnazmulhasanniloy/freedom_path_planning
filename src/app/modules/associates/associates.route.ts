import { Router } from 'express';
import { associatesController } from './associates.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import parseData from '@app/middleware/parseData';
import multer, { memoryStorage } from 'multer';

const router = Router();
const uploads = multer({ storage: memoryStorage() });


router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('photo'),
  parseData(),
  associatesController.createAssociates,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('photo'),
  parseData(),
  associatesController.updateAssociates,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  associatesController.deleteAssociates,
);
router.get('/:id', associatesController.getAssociatesById);
router.get('/', associatesController.getAllAssociates);

export const associatesRoutes = router;
