import { associatesRoutes } from '@app/modules/associates/associates.route';
import { authRoutes } from '@app/modules/auth/auth.route';
import { bookResourcesRoutes } from '@app/modules/bookResources/bookResources.route';
import { contentsRoutes } from '@app/modules/contents/contents.route';
import { otpRoutes } from '@app/modules/otp/otp.routes';
import serviceRouter from '@app/modules/services/service.routes';
import { testimonialRoutes } from '@app/modules/testimonial/testimonial.route';
import { toolResourceRoutes } from '@app/modules/toolResource/toolResource.route';
import { userRoutes } from '@app/modules/users/users.routes';
import { Router } from 'express';

const router = Router();
const moduleRoutes = [
  {
    path: '/book-resources',
    route: bookResourcesRoutes,
  },
  {
    path: '/tool-resource',
    route: toolResourceRoutes,
  },

  {
    path: '/testimonial',
    route: testimonialRoutes,
  },
  {
    path: '/associates',
    route: associatesRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/contents',
    route: contentsRoutes,
  },
  {
    path: '/services',
    route: serviceRouter,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
