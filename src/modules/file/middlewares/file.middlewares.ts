import { Request, Response, NextFunction } from 'express'

import fileServices from '../services/file.services'

class FileMiddlewares {
  async validateFileExists(req: Request, res: Response, next: NextFunction) {
    try {
      const existingFile = await fileServices.getFileById(req.params.id)
      if (existingFile) return next()
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(404).json({ msg: err.message })
      }
    }
  }
}

export default new FileMiddlewares()
