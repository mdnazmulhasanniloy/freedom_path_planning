import { Router } from 'express';
import { downloadsBookController } from './downloadsBook.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';

const router = Router();

router.post('/', downloadsBookController.createDownloadsBook);
// router.patch(
//   '/:id',
//   auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
//   downloadsBookController.updateDownloadsBook,
// );
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  downloadsBookController.deleteDownloadsBook,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  downloadsBookController.getDownloadsBookById,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  downloadsBookController.getAllDownloadsBook,
);

export const downloadsBookRoutes = router;
