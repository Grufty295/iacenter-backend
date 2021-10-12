import fs from 'fs'
import util from 'util'
import path from 'path'

import FileModel from '../models/file.model'

import { CustomLabels, PaginateOptions, PaginateResult } from 'mongoose'

import { ICreateFileInput, IFileDoc } from '../interfaces/file.interface'
import { IPaginationOptions } from 'modules/common/interfaces/common.paginationOptions.interface'

class FilesServices {
  async addFile(file: ICreateFileInput): Promise<IFileDoc> {
    const newFile: IFileDoc = new FileModel(file)
    await newFile.save()
    return newFile
  }

  async getFiles(
    pagination: IPaginationOptions,
  ): Promise<PaginateResult<IFileDoc> | undefined> {
    const paginationCustomLabes: CustomLabels = {
      totalDocs: 'fileCount',
      docs: 'filesList',
    }
    const paginationOptions: PaginateOptions = {
      limit: pagination.limit,
      page: pagination.page,
      customLabels: paginationCustomLabes,
      populate: {
        model: 'User',
        path: 'uploadedBy',
        select: 'name',
        match: { $regex: pagination.query },
      },
    }

    let filesList

    try {
      filesList = await FileModel.paginate(
        { originalName: { $regex: pagination.query, $options: 'i' } },
        paginationOptions,
      )
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err)
        throw new Error(err.message)
      }
    }

    return filesList
  }

  async getFileById(id: string): Promise<IFileDoc> {
    try {
      const existingUser = await FileModel.findById({ _id: id }).orFail().exec()
      return existingUser
    } catch (err: unknown) {
      throw new Error('Not found any file')
    }
  }

  async deleteFileById(id: string): Promise<IFileDoc | null> {
    const existingFile = await FileModel.findByIdAndDelete(id, {
      new: true,
    }).exec()

    if (existingFile) {
      const unlink = util.promisify(fs.unlink)
      await unlink(path.resolve(existingFile.path))
    }

    return existingFile
  }
}

export default new FilesServices()
