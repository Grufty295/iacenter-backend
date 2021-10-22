import { ServerErrorException } from '../../../exceptions/index'

import FileModel from '../models/file.model'

import { CustomLabels, PaginateOptions, PaginateResult } from 'mongoose'

import { ICreateFileInput, IFileDoc } from '../interfaces/file.interface'
import { IPaginationOptions } from 'modules/common/interfaces/common.paginationOptions.interface'
import NotFoundException from '../../../exceptions/NotFoundException'

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
      },
    }

    let filesList

    try {
      filesList = await FileModel.paginate({}, paginationOptions)
    } catch (err: unknown) {
      throw new ServerErrorException()
    }

    return filesList
  }

  async getFileById(id: string): Promise<IFileDoc> {
    try {
      const existingUser = await FileModel.findById({ _id: id }).orFail().exec()
      return existingUser
    } catch (err: unknown) {
      throw new NotFoundException('File')
    }
  }
}

export default new FilesServices()
