import { Express, Request } from 'express'
import path from 'path'
import multer from 'multer'
import { FileExtensions } from '../modules/common/interfaces/common.fileExtension.enum'

class Multer {
  private multerStorageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public')
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${new Date().toUTCString().replace(/\s/g, '')}_${
          file.originalname.replace(/\s/g, '').split('.')[0]
        }${path.extname(file.originalname)}`,
      )
    },
  })

  private multerFilterConfig = (
    req: Request,
    file: Express.Multer.File,
    cb: any,
  ) => {
    if (
      Object.values(FileExtensions).includes(
        file.mimetype.toLowerCase().split('/')[1] as FileExtensions,
      )
    ) {
      cb(null, true)
    } else {
      cb(new Error('Not a valid file type'), false)
    }
  }

  public upload = multer({
    storage: this.multerStorageConfig,
    fileFilter: this.multerFilterConfig,
    limits: { fileSize: 10 * 1024 * 1024, files: 12 },
  })
}

export default new Multer()
