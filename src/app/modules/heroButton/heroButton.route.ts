
import { Router } from 'express';
import { heroButtonController } from './heroButton.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';

const router = Router();

router.post('/',auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.sub_admin), heroButtonController.createHeroButton);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.sub_admin),
  heroButtonController.updateHeroButton,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.sub_admin),
  heroButtonController.deleteHeroButton,
);
router.get('/:id', heroButtonController.getHeroButtonById);
router.get('/', heroButtonController.getAllHeroButton);

export const heroButtonRoutes = router;