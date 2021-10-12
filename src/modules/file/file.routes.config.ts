import { Application } from 'express'

import { API_PATHS__V1 } from '../../config/apiPaths.config'

import { CommonRoutesConfig } from '../common/common.routes.config'
import FileRouter from './routes/file.routes'

export class FileRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'FileRoutes')
  }

  configureRoutes(): Application {
    return this.app.use(API_PATHS__V1.FILES_PATH, FileRouter)
  }
}
