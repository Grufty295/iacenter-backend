import { Document, Schema } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  role: string
  state: boolean
}
export interface IUserDoc extends IUser, Document {
  createdAt: Schema.Types.Date
  updatedAt: Schema.Types.Date
}
export interface ICreateUserInput {
  name: IUser['name']
  email: IUser['email']
  password: IUser['password']
  role: IUser['role']
}

export interface IUpdateUserInput extends Partial<ICreateUserInput> {}
