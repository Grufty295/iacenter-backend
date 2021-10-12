/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

import { FileExtensions } from '../../common/interfaces/common.fileExtension.enum'
import { IFileDoc } from '../interfaces/file.interface'

const FileSchema = new Schema(
  {
    uploadedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    originalName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    extension: {
      type: String,
      required: true,
      enum: [...Object.values(FileExtensions)],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)
FileSchema.plugin(mongoosePaginate)

FileSchema.methods.toJSON = function () {
  const { __v, _id, ...rest } = this.toObject()

  return {
    id: _id,
    ...rest,
  }
}

export default model<IFileDoc>('File', FileSchema)
