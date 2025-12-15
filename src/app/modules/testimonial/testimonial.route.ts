import { Router } from 'express';
import { testimonialController } from './testimonial.controller';
import multer, { memoryStorage } from 'multer';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import parseData from '@app/middleware/parseData';
import uploadSingle from '@app/middleware/uploadSingle';

const router = Router();
const uploads = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('clientPhoto'),
  parseData(),
  uploadSingle('clientPhoto'),
  testimonialController.createTestimonial,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('clientPhoto'),
  parseData(),
  uploadSingle('clientPhoto'),
  testimonialController.updateTestimonial,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  testimonialController.deleteTestimonial,
);
router.get('/:id', testimonialController.getTestimonialById);
router.get('/', testimonialController.getAllTestimonial);

export const testimonialRoutes = router;
