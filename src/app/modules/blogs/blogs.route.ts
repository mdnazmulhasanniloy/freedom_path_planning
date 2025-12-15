import { Router } from 'express';
import { blogsController } from './blogs.controller';
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
  uploads.single('image'),
  parseData(),
  uploadSingle('image'),
  blogsController.createBlogs,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('image'),
  parseData(),
  uploadSingle('image'),
  blogsController.updateBlogs,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  blogsController.deleteBlogs,
);
router.get('/:id', blogsController.getBlogsById);
router.get('/', blogsController.getAllBlogs);

export const blogsRoutes = router;
