import { Router } from 'express';
import { homePageContentsController } from './homePageContents.controller';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import multer from 'multer';
import parseData from '@app/middleware/parseData';

const router = Router();
const uploads = multer({ storage: multer.memoryStorage() });

router.put(
  '/hero-section',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('heroImg'),
  parseData(),
  homePageContentsController.updateHomePageHeroSection,
);
router.get('/hero-section', homePageContentsController.getHomePageHeroSection);

router.put(
  '/service-section',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('servicePageImg'),
  parseData(),
  homePageContentsController.updateHomePageServiceSection,
);
router.get(
  '/service-section',
  homePageContentsController.getHomePageServiceSection,
);

router.put(
  '/service-details-page-whats-included-section',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  homePageContentsController.updateServiceDetailsPageWhatsIncludedSection,
);
router.get(
  '/service-details-page-whats-included-section',
  homePageContentsController.getServiceDetailsPageWhatsIncludedSection,
);

router.put(
  '/service-details-page-blog-section',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  homePageContentsController.updateServiceDetailsPageBlogSection,
);
router.get(
  '/service-details-page-blog-section',
  homePageContentsController.getServiceDetailsPageBlogSection,
);

router.put(
  '/resources-section',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  homePageContentsController.updateResourcesSection,
);
router.get(
  '/resources-section',
  homePageContentsController.getResourcesSection,
);

router.put(
  '/resources-page',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('image'),
  parseData(),
  homePageContentsController.updateResourcesPage,
);
router.get('/resources-page', homePageContentsController.getResourcesPage);

router.put(
  '/learn-and-grow-with-our-books-section',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  homePageContentsController.updateLearnAndGrowWithOurBooksSection,
);
router.get(
  '/learn-and-grow-with-our-books-section',
  homePageContentsController.getLearnAndGrowWithOurBooksSection,
);

router.put(
  '/testimonial-section',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  homePageContentsController.updateTestimonialSection,
);
router.get(
  '/testimonial-section',
  homePageContentsController.getTestimonialSection,
);

export const homePageContentsRoutes = router;
