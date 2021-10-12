import { Document, Schema } from 'mongoose'

import { IUserDoc } from '../../user/interfaces/user.interface'

export interface IFile {
  originalName: string
  path: string
  extension: string
  uploadedBy: IUserDoc['_id']
}

export interface IFileDoc extends IFile, Document {
  createdAt: Schema.Types.Date
}

export interface ICreateFileInput {
  originalName: IFileDoc['originalName']
  path: IFileDoc['path']
  extension: IFileDoc['extension']
  uploadedBy: IFileDoc['uploadedBy']
}
