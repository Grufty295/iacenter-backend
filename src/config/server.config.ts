import express, { Application } from 'express'
import cors from 'cors'
import errorMiddleware from '../middleware/error.middleware'
import loggerMiddleware from '../middleware/logger.middleware'
import DB from './db.config'

class Server {
  private app: Application
  private port: string

  constructor() {
    this.app = express()
    this.port = process.env.PORT || '8080'

    // Connection to db
    this.dbconnection()

    // Sever configuration middlewares
    this.configMiddlewares()
  }

  async dbconnection(): Promise<void> {
    const db = new DB()
    await db.connection()
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
