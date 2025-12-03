import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { validate } from '../../middlewares/validate.js';
import editorialController from '../../controllers/dashboard/editorial.controller.js';
import {
  createEditorialSchema,
  updateEditorialSchema,
  createHintSchema,
  updateHintSchema
} from '../../validation/dashboard/editorialValidation.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateJWT);
router.use(isAdmin);

// Editorial routes
router.post('/problems/:problemId', validate(createEditorialSchema), editorialController.createEditorial);
router.get('/problems/:problemId', editorialController.getEditorial);
router.put('/:editorialId', validate(updateEditorialSchema), editorialController.updateEditorial);
router.delete('/:editorialId', editorialController.deleteEditorial);

// Hint routes
router.post('/:editorialId/hints', validate(createHintSchema), editorialController.addHint);
router.get('/:editorialId/hints', editorialController.getHints);
router.put('/hints/:hintId', validate(updateHintSchema), editorialController.updateHint);
router.delete('/hints/:hintId', editorialController.deleteHint);

export default router;
