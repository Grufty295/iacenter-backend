import express, { Application } from 'express'
import cors from 'cors'

class Server {
  private app: Application
  private port: string

  constructor() {
    this.app = express()
    this.port = process.env.PORT || '8080'

    this.configMiddlewares()
  }

  configMiddlewares(): void {
    // CORS
    this.app.use(cors())
    // BodyParse
    this.app.use(express.json())
    // Public Folder
    this.app.use(express.static('public'))
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log('Server running on port:', this.port)
    })
  }
}

export default Server
