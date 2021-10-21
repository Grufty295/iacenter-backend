import { Router } from 'express'

import multer from '../../../config/multer.config'

import fileController from '../controllers/file.controller'

import jwtMiddlewares from '../../auth/middlewares/jwt.middlewares'

const router = Router()

router.get('/', [jwtMiddlewares.validJWTNeeded], fileController.getAllFiles)

router.post(
  '/upload',
  [jwtMiddlewares.validJWTNeeded, multer.upload.array('files', 10)],
  fileController.addFile,
)

export default router
