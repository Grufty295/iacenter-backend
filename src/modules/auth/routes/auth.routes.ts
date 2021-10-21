import { Router } from 'express'
import { body } from 'express-validator'

import AuthController from '../controllers/auth.controller'

import authMiddlewares from '../middlewares/auth.middlewares'
import bodyValidationMiddleware from '../../common/middlewares/body.validation.middleware'
import commonRoleMiddleware from '../../common/middlewares/common.role.middleware'
import jwtMiddlewares from '../middlewares/jwt.middlewares'
import userMiddlewares from '../../user/middlewares/user.middlewares'

const router = Router()

router.post(
  '/login',
  [
    body('email', 'Invalid email').isEmail(),
    body('password', 'User password is required').notEmpty(),
    bodyValidationMiddleware.validateBodyFieldsErrors,
    authMiddlewares.verifyUserPassword,
  ],
  AuthController.login,
)

router.post(
  '/signup',
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
  AuthController.signup,
)

router.post(
  '/renew',
  [jwtMiddlewares.validRefreshNeeded],
  AuthController.refreshToken,
)

export default router
