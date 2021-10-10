/* eslint-disable no-use-before-define */
import { Document } from 'mongoose'

import { IUserDoc } from 'modules/user/interfaces/user.interface'

export interface IRefreshToken {
  user: IUserDoc['_id']
  token: string
  expires: Date
  revokedAt: Date
  replacedByToken: string
}

export interface IRefreshTokenDoc extends IRefreshToken, Document {
  createdAt: Date
  isExpired: boolean
  isActive: boolean
}

export interface IRefreshTokenPopulated extends IRefreshTokenDoc {
  user: IUserDoc
}

export interface ICreateRefreshTokenInput {
  user: IUserDoc['_id']
  token?: IRefreshToken['token']
  expires?: IRefreshToken['expires']
}
