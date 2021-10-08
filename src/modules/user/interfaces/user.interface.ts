export interface IUser {
  name: string
  email: string
  password: string
  role: string
  state: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ICreateUserModel {
  name: string
  email: string
  password: string
  role: string
}

export interface IUpdateUserModel extends Partial<ICreateUserModel> {}
