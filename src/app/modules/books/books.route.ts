import { Router } from 'express';
import { booksController } from './books.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '@app/middleware/parseData';
import uploadMultiple from '@app/middleware/uploadMulti';

const router = Router();
const uploads = multer({ storage: memoryStorage() });

const fileArr = [
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
];
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.fields(fileArr),
  parseData(),
  uploadMultiple(fileArr),
  booksController.createBooks,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.fields(fileArr),
  parseData(),
  uploadMultiple(fileArr),
  booksController.updateBooks,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  booksController.deleteBooks,
);
router.get('/:id', booksController.getBooksById);
router.get('/', booksController.getAllBooks);

export const booksRoutes = router;
