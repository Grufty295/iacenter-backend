import UserModel from '../models/user.model'
import { CustomLabels, PaginateOptions, FilterQuery } from 'mongoose'
import {
  IUser,
  ICreateUserModel,
  IUpdateUserModel,
} from '../interfaces/user.interface'

class UsersServices {
  async addUser(userFields: ICreateUserModel) {
    const user = new UserModel(userFields)
    await user.save()
    return user
  }

  async getUsers(limit: number, page: number, query: string) {
    const paginationCustomLabes: CustomLabels = {
      totalDocs: 'userCount',
      docs: 'usersList',
    }
    const paginationOptions: PaginateOptions = {
      limit,
      page,
      customLabels: paginationCustomLabes,
    }

    const condition: FilterQuery<IUser> = {
      $and: [
        {
          $or: [{ name: { $regex: query } }, { email: { $regex: query } }],
        },
        { state: true },
      ],
    }

    const usersList = await UserModel.paginate(condition, paginationOptions)

    return usersList
  }

  async getUserById(userId: string) {
    const existingUser = await UserModel.findById({ _id: userId }).exec()
    return existingUser
  }

  async getUserByEmail(email: string) {
    const existingUser = await UserModel.findOne({ email }).exec()
    return existingUser
  }

  async updateUserById(userId: string, userFields: IUpdateUserModel) {
    const existingUser = await UserModel.findByIdAndUpdate(userId, userFields, {
      new: true,
    }).exec()

    return existingUser
  }

  async deleteUserById(userId: string) {
    const existingUser = await UserModel.findByIdAndUpdate(
      userId,
      { state: false },
      { new: true },
    ).exec()
    return existingUser
  }
}

export default new UsersServices()
