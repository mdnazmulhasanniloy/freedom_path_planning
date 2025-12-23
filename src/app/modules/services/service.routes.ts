import { Router } from 'express';
import { serviceController } from './services.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '@app/middleware/parseData';
import auth from '@app/middleware/auth';
import { USER_ROLE } from '../users/user.constants';
import uploadSingle from '@app/middleware/uploadSingle';
import validateRequest from '@app/middleware/validateRequest';
import ServiceValidation from './services.validation';

const router = Router();
const uploads = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('image'),
  parseData(),
  uploadSingle('image'),
  validateRequest(ServiceValidation.createValidation),
  serviceController.createService,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('image'),
  parseData(),
  uploadSingle('image'),
  validateRequest(ServiceValidation.updateValidation),
  serviceController.updateService,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  serviceController.deleteService,
);
router.get('/:id', serviceController.getServiceById);
router.get('/', serviceController.getAllService);

const serviceRouter = router;
export default serviceRouter;
