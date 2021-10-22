import UserModel from '../models/user.model'

import DuplicatedResourceException from '../../../exceptions/DuplicatedResourceErrorException'

import {
  CustomLabels,
  PaginateOptions,
  FilterQuery,
  PaginateResult,
} from 'mongoose'
import {
  ICreateUserInput,
  IUpdateUserInput,
  IUserDoc,
} from '../interfaces/user.interface'
import { IPaginationOptions } from 'modules/common/interfaces/common.paginationOptions.interface'

class UsersServices {
  async addUser(user: ICreateUserInput): Promise<IUserDoc> {
    const newUser: IUserDoc = new UserModel(user)

    try {
      await newUser.save()
    } catch (err: unknown) {
      throw new DuplicatedResourceException()
    }
    return newUser
  }

  async getUsers(
    pagination: IPaginationOptions,
  ): Promise<PaginateResult<IUserDoc>> {
    const paginationCustomLabes: CustomLabels = {
      totalDocs: 'userCount',
      docs: 'usersList',
    }
    const paginationOptions: PaginateOptions = {
      limit: pagination.limit,
      customLabels: paginationCustomLabes,
      sort: pagination.sort,
      offset: pagination.offset,
    }

    const condition: FilterQuery<IUserDoc> = {
      $and: [
        {
          $or: [
            { name: { $regex: pagination.query } },
            { email: { $regex: pagination.query } },
          ],
        },
        { state: true },
      ],
    }

    const usersList = await UserModel.paginate(condition, paginationOptions)

    return usersList
  }

  async getUserById(id: string): Promise<IUserDoc> {
    const existingUser = await UserModel.findById({ _id: id }).orFail().exec()
    return existingUser
  }

  async getUserByEmail(email: string): Promise<IUserDoc> {
    const existingUser = await UserModel.findOne({
      email,
      state: true,
    }).exec()
    return existingUser as IUserDoc
  }

  async getUserByEmailWithPassword(email: string): Promise<IUserDoc> {
    const existingUserWithPassword = await UserModel.findOne({
      email,
      state: true,
    })
      .select('_id email role password')
      .orFail()
      .exec()
    return existingUserWithPassword
  }

  async updateUserById(
    id: string,
    user: IUpdateUserInput,
  ): Promise<IUserDoc | null> {
    const existingUser = await UserModel.findByIdAndUpdate({ _id: id }, user, {
      new: true,
    }).exec()

    return existingUser
  }

  async deleteUserById(id: string): Promise<IUserDoc | null> {
    const existingUser = await UserModel.findByIdAndUpdate(
      id,
      { state: false },
      { new: true },
    ).exec()
    return existingUser
  }
}

export default new UsersServices()
