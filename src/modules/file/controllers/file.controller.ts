import { Request, Response, Express } from 'express'

import { HttpException, NotFoundException } from '../../../exceptions'

import fileServices from '../services/file.services'
class FileController {
  async getAllFiles(req: Request, res: Response) {
    const { limit = 10, page = 1 } = req.query
    try {
      const files = await fileServices.getFiles({
        limit: limit as number,
        page: page as number,
      })
      if (files === undefined || !files.filesList) {
        throw new NotFoundException('File')
      }

      return res.status(200).json(files)
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  addFile(req: Request, res: Response) {
    const { id } = res.locals.jwt

    try {
      if (req.files) {
        const files = req.files as Express.Multer.File[]

        files.forEach(async (file) => {
          await fileServices.addFile({
            uploadedBy: id,
            extension: file.mimetype.split('/')[1],
            originalName: file.originalname.split('.')[0],
            path: file.path,
          })
        })
      } else {
        return res.status(400).send()
      }
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }

    return res.status(201).json({ msg: 'File/s successfully uploaded' })
  }
}

export default new FileController()
