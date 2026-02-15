import { Router } from 'express';
import { footerContentController } from './footerContent.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  footerContentController.createFooterContent,
);
router.patch(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  footerContentController.updateFooterContent,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  footerContentController.deleteFooterContent,
);
router.get('/:id', footerContentController.getFooterContentById);
router.get('/', footerContentController.getAllFooterContent);

export const footerContentRoutes = router;
