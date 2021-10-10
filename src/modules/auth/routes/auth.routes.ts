import { Router } from 'express'
import { body, param } from 'express-validator'

import AuthController from '../controllers/auth.controller'

import AuthMiddlewares from '../middlewares/auth.middlewares'
import BodyValidationMiddleware from '../../common/middlewares/body.validation.middleware'
import CommonRoleMiddleware from '../../common/middlewares/common.role.middleware'
import JwtMiddlewares from '../middlewares/jwt.middlewares'

const router = Router()

router.post(
  '/login',
  [
    body('email', 'Invalid email').isEmail(),
    body('password', 'User password is required').notEmpty(),
    BodyValidationMiddleware.validateBodyFieldsErrors,
    AuthMiddlewares.verifyUserPassword,
  ],
  AuthController.login,
)

router.post(
  '/renew',
  [JwtMiddlewares.validRefreshNeeded],
  AuthController.refreshToken,
)

router.put(
  '/change-password/:id',
  [
    JwtMiddlewares.validJWTNeeded,
    param('id', 'Invalid ID').isMongoId(),
    body('oldPassword', 'The actual password is required').notEmpty(),
    body('newPassword', 'User password must be at least 8 characters')
      .isLength({
        min: 8,
      })
      .trim(),
    BodyValidationMiddleware.validateBodyFieldsErrors,
    CommonRoleMiddleware.validateOnlySameUserOrAdminCanMakeThisAction,
  ],
  AuthController.changePassword,
)

export default router
