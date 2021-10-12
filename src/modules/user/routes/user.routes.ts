import { Router } from 'express'
import { body, param } from 'express-validator'

import { Roles } from '../../common/interfaces/common.role.enum'

import UserController from '../controllers/user.controller'

import bodyValidationMiddleware from '../../common/middlewares/body.validation.middleware'
import commonRoleMiddleware from '../../common/middlewares/common.role.middleware'
import jwtMiddlewares from '../../auth/middlewares/jwt.middlewares'
import userMiddlewares from '../middlewares/user.middlewares'

const router = Router()

router.get(
  '/',
  [
    jwtMiddlewares.validJWTNeeded,
    commonRoleMiddleware.validateSpecificRoleRequired(Roles.ADMIN_ROLE),
  ],
  UserController.getAllUsers,
)

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
    bodyValidationMiddleware.validateBodyFieldsErrors,
    userMiddlewares.validateSameEmailDoesntExists,
    commonRoleMiddleware.validateRoleExists,
  ],
  UserController.addUser,
)

router.put(
  '/:id',
  [
    jwtMiddlewares.validJWTNeeded,
    param('id', 'Invalid ID').isMongoId(),
    body('name', 'Invalid User name').not().isNumeric().optional(),
    body('password', 'User cant change their password').isEmpty(),
    body('email', 'Invalid email').isEmail().optional(),
    body('role', 'Invalid role').isString().optional(),
    bodyValidationMiddleware.validateBodyFieldsErrors,
    userMiddlewares.validateUserExists,
    userMiddlewares.userCantChangeRole,
    commonRoleMiddleware.validateOnlySameUserOrAdminCanMakeThisAction,
    userMiddlewares.validateEmailUpdate,
  ],
  UserController.updateUser,
)

router.delete(
  '/:id',
  [
    jwtMiddlewares.validJWTNeeded,
    param('id', 'Invalid ID').isMongoId(),
    bodyValidationMiddleware.validateBodyFieldsErrors,
    userMiddlewares.validateUserExists,
    commonRoleMiddleware.validateOnlySameUserOrAdminCanMakeThisAction,
  ],
  UserController.deleteUser,
)

export default router
