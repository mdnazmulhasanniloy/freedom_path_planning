import { Router } from 'express';
import { aboutHeroSectionController } from './aboutHeroSection.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import multer, { memoryStorage } from 'multer';
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

  aboutHeroSectionController.createAboutHeroSection,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('banner'),
  parseData(),
  uploadSingle('banner'),
  aboutHeroSectionController.updateAboutHeroSection,
);
router.delete('/:id', aboutHeroSectionController.deleteAboutHeroSection);
router.get('/:id', aboutHeroSectionController.getAboutHeroSectionById);
router.get('/', aboutHeroSectionController.getAllAboutHeroSection);

export const aboutHeroSectionRoutes = router;
