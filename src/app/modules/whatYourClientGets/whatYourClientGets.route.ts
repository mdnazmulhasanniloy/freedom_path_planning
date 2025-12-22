import { Router } from 'express';
import { whatYourClientGetsController } from './whatYourClientGets.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import parseData from '@app/middleware/parseData';
import uploadSingle from '@app/middleware/uploadSingle';
import multer from 'multer';

const router = Router();
const uploads = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('image'),
  parseData(),
  uploadSingle('image'),
  whatYourClientGetsController.createWhatYourClientGets,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('image'),
  parseData(),
  uploadSingle('image'),
  whatYourClientGetsController.updateWhatYourClientGets,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  whatYourClientGetsController.deleteWhatYourClientGets,
);
router.get('/:id', whatYourClientGetsController.getWhatYourClientGetsById);
router.get('/', whatYourClientGetsController.getAllWhatYourClientGets);

export const whatYourClientGetsRoutes = router;
