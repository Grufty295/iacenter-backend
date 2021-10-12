/* eslint-disable no-use-before-define */
import { Document, Schema } from 'mongoose'

import { IUserDoc } from '../../user/interfaces/user.interface'

export interface IRefreshToken {
  user: IUserDoc['_id']
  token: string
  expires: Schema.Types.Date
  revokedAt: Schema.Types.Date
  replacedByToken: string
}

export interface IRefreshTokenDoc extends IRefreshToken, Document {
  createdAt: Schema.Types.Date
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
