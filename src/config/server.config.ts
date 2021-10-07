import express, { Application } from 'express'

import cors from 'cors'
import errorMiddleware from '../middlewares/error.middleware'
import loggerMiddleware from '../middlewares/logger.middleware'

import DB from './db.config'

import userRoutes from '../modules/user/routes/user.routes'

class Server {
  private app: Application
  private port: string
  private apiPaths = {
    users: '/api/v1/users',
  }

  constructor() {
    this.app = express()
    this.port = process.env.PORT || '8080'

    // Connection to db
    this.dbconnection()

    // Sever configuration middlewares
    this.configMiddlewares()

    // Server routes definition
    this.routes()
  }

  async dbconnection(): Promise<void> {
    const db = new DB()
    await db.connection()
  }

  routes(): void {
    this.app.use(this.apiPaths.users, userRoutes)
  }

  configMiddlewares(): void {
    // Simple Logging
    this.app.use(loggerMiddleware)
    // CORS
    this.app.use(cors())
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
    })
  }
}

export default Server
