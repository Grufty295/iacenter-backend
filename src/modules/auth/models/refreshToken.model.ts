/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model } from 'mongoose'

import { IRefreshTokenDoc } from '../interfaces/refreshToken.interface'

const RefreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id reference is required'],
      ref: 'User',
    },
    token: { type: String, required: [true, 'Token string is required'] },
    expires: { type: Date, required: [true, 'Expiration date is required'] },
    revokedAt: { type: Date },
    replacedByToken: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
  },
)

RefreshTokenSchema.virtual('isExpired').get(function (this: IRefreshTokenDoc) {
  return Date.now() >= this.expires.getTime()
})

RefreshTokenSchema.virtual('isActive').get(function (this: IRefreshTokenDoc) {
  return !this.revokedAt && !this.isExpired
})

RefreshTokenSchema.methods.toJSON = function () {
  const { __v, _id, ...rest } = this.toObject()

  return {
    id: _id,
    ...rest,
  }
}

export default model<IRefreshTokenDoc>('RefreshToken', RefreshTokenSchema)
