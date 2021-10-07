import { Router } from 'express'
import { check } from 'express-validator'

import fieldValidation from '../../../middlewares/fieldValidation.middleware'

import authController from '../controllers/auth.controller'

const router = Router()

router.post(
  '/login',
  [
    check('email', 'Invalid email').isEmail(),
    check('password', 'User password is required').notEmpty(),
    fieldValidation,
  ],
  authController.login,
)

export default router
