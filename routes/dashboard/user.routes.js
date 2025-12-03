import express from 'express';
import { authenticateJWT } from '../../middlewares/auth.js';
import { isAdmin } from '../../middlewares/isAdmin.js';
import { validate } from '../../middlewares/validate.js';
import userController from '../../controllers/dashboard/user.controller.js';
import {
  getUsersSchema,
  updateUserSchema,
  updateUserRoleSchema
} from '../../validation/dashboard/userValidation.js';

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticateJWT);
router.use(isAdmin);

// User management routes
router.get('/', validate(getUsersSchema, 'query'), userController.getUsers);
router.get('/:userId', userController.getUser);
router.put('/:userId', validate(updateUserSchema), userController.updateUser);
router.patch('/:userId/role', validate(updateUserRoleSchema), userController.updateRole);
router.patch('/:userId/activate', userController.activateUser);
router.patch('/:userId/deactivate', userController.deactivateUser);
router.delete('/:userId', userController.deleteUser);

export default router;
