import { Router } from 'express'
import { body, param } from 'express-validator'

import UserController from '../controllers/user.controller'

import BodyValidationMiddleware from '../../common/middlewares/body.validation.middleware'
import UserMiddlewares from '../middlewares/user.middlewares'
import CommonRoleMiddleware from '../../common/middlewares/common.role.middleware'

const router = Router()

// TODO: Auth validations

router.get('/', UserController.getAllUsers)

router.post(
  '/',
  [
    body('name', 'User name is required').notEmpty(),
    body('password', 'User password must be at least 8 characters')
      .isLength({
        min: 8,
      })
      .trim(),
    body('email', 'Invalid email').isEmail(),
    BodyValidationMiddleware.validateBodyFieldsErrors,
    UserMiddlewares.validateSameEmailDoesntExists,
    CommonRoleMiddleware.validateRoleExists,
  ],
  UserController.addUser,
)

router.put(
  '/:id',
  [
    param('id', 'Invalid ID').isMongoId(),
    body('name', 'Invalid User name').not().isNumeric().optional(),
    body('password', 'User password must be at least 8 characters')
      .isLength({
        min: 8,
      })
      .trim()
      .optional(),
    body('email', 'Invalid email').isEmail().optional(),
    body('role', 'Invalid role').isString().optional(),
    BodyValidationMiddleware.validateBodyFieldsErrors,
    UserMiddlewares.validateUserExists,
    CommonRoleMiddleware.validateRoleExists,
    UserMiddlewares.validateEmailUpdate,
  ],
  UserController.updateUser,
)

router.delete(
  '/:id',
  [
    param('id', 'Invalid ID').isMongoId(),
    BodyValidationMiddleware.validateBodyFieldsErrors,
    UserMiddlewares.validateUserExists,
  ],
  UserController.deleteUser,
)

export default router
