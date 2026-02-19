import { Router } from 'express';
import { contactUsPageContentsController } from './contactUsPageContents.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import multer from 'multer';
import parseData from '@app/middleware/parseData';

const router = Router();
const uploads = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('banner'),
  parseData(),
  contactUsPageContentsController.updateContactUsContents,
);
router.get('/', contactUsPageContentsController.getContactUsContents);

export const contactUsPageContentsRoutes = router;
