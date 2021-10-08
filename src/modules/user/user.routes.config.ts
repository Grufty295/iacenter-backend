import { Application } from 'express'

import API_PATHS__V1 from '../../config/apiPaths.config'

import { CommonRoutesConfig } from '../common/common.routes.config'
import UserRouter from './routes/user.routes'

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, 'UserRoutes')
  }

  configureRoutes(): Application {
    return this.app.use(API_PATHS__V1.USERS_PATH, UserRouter)
  }
}
