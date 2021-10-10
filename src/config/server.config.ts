import express, { Application } from 'express'

import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorMiddleware from '../middlewares/error.middleware'
import loggerMiddleware from '../middlewares/logger.middleware'

import DB from './db.config'
import config from './values.config'

import { CommonRoutesConfig } from '../modules/common/common.routes.config'
import { UserRoutes } from '../modules/user/user.routes.config'
import { AuthRoutes } from '../modules/auth/auth.routes.config'

class Server {
  private app: Application
  private port: string
  private routes: Array<CommonRoutesConfig> = []

  constructor() {
    this.app = express()
    this.port = config.PORT || '8080'

    // Connection to db
    this.dbconnection()

    // Sever configuration middlewares
    this.configMiddlewares()

    // Server routes definition
    this.configRoutes()
  }

  async dbconnection(): Promise<void> {
    const db = new DB()
    await db.connection()
  }

  configRoutes(): void {
    this.routes.push(new UserRoutes(this.app))
    this.routes.push(new AuthRoutes(this.app))
  }

  configMiddlewares(): void {
    // Simple Logging
    this.app.use(loggerMiddleware)
    // CORS
    this.app.use(cors())
    // CookieParse
    this.app.use(cookieParser())
    // BodyParse
    this.app.use(express.json())
    // Public Folder
    this.app.use(express.static('public'))
    // Simple Error Handling
    this.app.use(errorMiddleware)
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log('Server running on port:', this.port)
      this.routes.forEach((route: CommonRoutesConfig) => {
        console.log(`Routes configured for ${route.getName()}`)
      })
    })
  }
}

export default Server
