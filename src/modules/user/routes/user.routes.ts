import { Router } from 'express'
import { body, param } from 'express-validator'

import { Roles } from '../../common/interfaces/common.role.enum'

import UserController from '../controllers/user.controller'

import BodyValidationMiddleware from '../../common/middlewares/body.validation.middleware'
import CommonRoleMiddleware from '../../common/middlewares/common.role.middleware'
import JwtMiddlewares from '../../auth/middlewares/jwt.middlewares'
import UserMiddlewares from '../middlewares/user.middlewares'

const router = Router()

// TODO: Auth validations

router.get(
  '/',
  [
    JwtMiddlewares.validJWTNeeded,
    CommonRoleMiddleware.validateSpecificRoleRequired(Roles.ADMIN_ROLE),
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
    BodyValidationMiddleware.validateBodyFieldsErrors,
    UserMiddlewares.validateSameEmailDoesntExists,
    CommonRoleMiddleware.validateRoleExists,
  ],
  UserController.addUser,
)

router.put(
  '/:id',
  [
    JwtMiddlewares.validJWTNeeded,
    param('id', 'Invalid ID').isMongoId(),
    body('name', 'Invalid User name').not().isNumeric().optional(),
    body('password', 'User cant change their password').isEmpty(),
    body('email', 'Invalid email').isEmail().optional(),
    body('role', 'Invalid role').isString().optional(),
    BodyValidationMiddleware.validateBodyFieldsErrors,
    UserMiddlewares.validateUserExists,
    UserMiddlewares.userCantChangeRole,
    CommonRoleMiddleware.validateOnlySameUserOrAdminCanMakeThisAction,
    UserMiddlewares.validateEmailUpdate,
  ],
  UserController.updateUser,
)

router.delete(
  '/:id',
  [
    JwtMiddlewares.validJWTNeeded,
    param('id', 'Invalid ID').isMongoId(),
    BodyValidationMiddleware.validateBodyFieldsErrors,
    UserMiddlewares.validateUserExists,
    CommonRoleMiddleware.validateOnlySameUserOrAdminCanMakeThisAction,
  ],
  UserController.deleteUser,
)

export default router
