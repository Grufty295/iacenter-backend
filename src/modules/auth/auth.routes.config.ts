import { Application } from 'express'

import { API_PATHS__V1 } from '../../config/apiPaths.config'

import { CommonRoutesConfig } from '../common/common.routes.config'
import AuthRouter from './routes/auth.routes'

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'AuthRoutes')
  }

  configureRoutes(): Application {
    return this.app.use(API_PATHS__V1.AUTH_PATH, AuthRouter)
  }
}
