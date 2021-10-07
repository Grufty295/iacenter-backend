import { Router } from 'express'
import { check } from 'express-validator'

import fieldValidation from '../../../middleware/fieldValidation.middleware'

import {
  existingEmail,
  isValidRole,
} from '../../../helpers/modelValidators/modelValidators.helper'

import userController from '../controllers/user.controller'

const router = Router()

router.get('/')
router.get('/:id')
router.post(
  '/',
  [
    check('name', 'User name is required').notEmpty(),
    check('password', 'User password must be at least 8 characters').isLength({
      min: 8,
    }),
    check('email', 'Invalid email').isEmail(),
    check('email').custom(existingEmail),
    check('role').custom(isValidRole),
    fieldValidation,
  ],
  userController.addUser,
)
router.put('/:id')
router.delete('/id')

export default router
