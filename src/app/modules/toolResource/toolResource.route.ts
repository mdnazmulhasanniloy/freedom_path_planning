
import { Router } from 'express';
import { toolResourceController } from './toolResource.controller';

const router = Router();

router.post('/', toolResourceController.createToolResource);
router.patch('/:id', toolResourceController.updateToolResource);
router.delete('/:id', toolResourceController.deleteToolResource);
router.get('/:id', toolResourceController.getToolResourceById);
router.get('/', toolResourceController.getAllToolResource);

export const toolResourceRoutes = router;