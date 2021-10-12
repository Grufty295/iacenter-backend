import { Request, Response, Express } from 'express'

import fileServices from '../services/file.services'

class FileController {
  async getAllFiles(req: Request, res: Response) {
    const { limit = 10, page = 1, query = '' } = req.query
    console.log(query)
    try {
      const files = await fileServices.getFiles({
        limit: limit as number,
        page: page as number,
        query: query as string,
      })

      if (!files?.docs) {
        return res.status(404).json({ msg: 'Any file was found' })
      }

      return res.status(200).json(files)
    } catch (err: unknown) {
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to de administrator', err })
    }
  }

  addFile(req: Request, res: Response) {
    const { id } = res.locals.jwt

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

    return res.status(201).json({ msg: 'File/s successfully uploaded' })
  }

  async deleteFile(req: Request, res: Response) {
    const { id } = req.params
    try {
      await fileServices.deleteFileById(id)
      res.json({ msg: 'File was succesfully deleted' })
    } catch (err: unknown) {
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to de administrator' })
    }
  }
}

export default new FileController()
