/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

import { IUser } from '../interfaces/user.interface'
import { Roles } from '../interfaces/role.interface'

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'User name is required'] },
    email: {
      type: String,
      unique: true,
      required: [true, 'User email is required'],
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
    },
    role: {
      type: String,
      required: true,
      default: Roles.USER_ROLE,
      enum: [...Object.values(Roles)],
    },
  },
  { timestamps: true },
)
UserSchema.plugin(mongoosePaginate)

UserSchema.methods.toJSON = function () {
  const { __v, password, ...publicUser } = this.toObject()
  return publicUser
}

export default model<IUser>('User', UserSchema)