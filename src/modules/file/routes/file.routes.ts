import { Router } from 'express'
import { param } from 'express-validator'

import multer from '../../../config/multer.config'
import { Roles } from '../../common/interfaces/common.role.enum'

import fileController from '../controllers/file.controller'

import bodyValidationMiddleware from '../../common/middlewares/body.validation.middleware'
import commonRoleMiddleware from '../../common/middlewares/common.role.middleware'
import fileMiddlewares from '../middlewares/file.middlewares'
import jwtMiddlewares from '../../auth/middlewares/jwt.middlewares'

const router = Router()

router.get('/', [jwtMiddlewares.validJWTNeeded], fileController.getAllFiles)

router.post(
  '/upload',
  [jwtMiddlewares.validJWTNeeded, multer.upload.array('files', 10)],
  fileController.addFile,
)

router.delete(
  '/:id',
  [
    jwtMiddlewares.validJWTNeeded,
    param('id', 'Invalid ID').isMongoId(),
    bodyValidationMiddleware.validateBodyFieldsErrors,
    fileMiddlewares.validateFileExists,
    commonRoleMiddleware.validateSpecificRoleRequired(Roles.ADMIN_ROLE),
  ],
  fileController.deleteFile,
)

export default router
