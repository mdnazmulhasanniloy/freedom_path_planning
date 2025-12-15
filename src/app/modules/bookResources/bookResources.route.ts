import { Router } from 'express';
import { bookResourcesController } from './bookResources.controller';
import multer, { memoryStorage } from 'multer';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import parseData from '@app/middleware/parseData';
import uploadMultiple from '@app/middleware/uploadMulti';

const router = Router();
const uploads = multer({ storage: memoryStorage() });
const fileArr = [
  { name: 'file', maxCount: 1, folder: 'images/books' },
  { name: 'image', maxCount: 1, folder: 'images/books' },
];
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.fields(fileArr),
  parseData(),
  uploadMultiple(fileArr),
  bookResourcesController.createBookResources,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.fields(fileArr),
  parseData(),
  uploadMultiple(fileArr),
  bookResourcesController.updateBookResources,
);
router.delete('/:id', bookResourcesController.deleteBookResources);
router.get('/:id', bookResourcesController.getBookResourcesById);
router.get('/', bookResourcesController.getAllBookResources);

export const bookResourcesRoutes = router;
