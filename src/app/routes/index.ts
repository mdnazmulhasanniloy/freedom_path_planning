import { authRoutes } from '@app/modules/auth/auth.route';
import { contentsRoutes } from '@app/modules/contents/contents.route';
import { otpRoutes } from '@app/modules/otp/otp.routes';
import serviceRouter from '@app/modules/services/service.route';
import { userRoutes } from '@app/modules/users/users.routes';
import { Router } from 'express';

import { associatesRoutes } from "../modules/associates/associates.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/associates",
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
