// import config from '../../../config/values.config'

import RefreshTokenModel from '../models/refreshToken.model'

import {
  // IRefreshToken,
  IRefreshTokenDoc,
  IRefreshTokenPopulated,
  ICreateRefreshTokenInput,
} from '../interfaces/refreshToken.interface'
import { IUserDoc } from '../../user/interfaces/user.interface'

import CryptographyServices from '../../common/services/cryptography.services'

class AuthServices {
  async checkIfPasswordsIdenticals(user: IUserDoc, passwordToCheck: string) {
    try {
      return await CryptographyServices.decrypt(passwordToCheck, user.password)
    } catch (err: unknown) {
      throw Error()
    }
  }

  async generateRefreshToken(
    refreshToken: ICreateRefreshTokenInput,
  ): Promise<IRefreshTokenDoc> {
    const {
      user,
      token = CryptographyServices.randomString(),
      expires = new Date(Date.now() + 4 * 60 * 60),
    } = refreshToken

    const newRefreshToken = new RefreshTokenModel({
      user,
      token,
      expires,
    })

    await newRefreshToken.save()

    return newRefreshToken
  }

  async getRefreshToken(token: string): Promise<IRefreshTokenPopulated> {
    const refreshToken = await RefreshTokenModel.findOne({ token })
      .populate('user')
      .exec()

    if (!refreshToken || !refreshToken.isActive) {
      throw Error('Invalid token')
    }

    return refreshToken
  }
}

export default new AuthServices()
