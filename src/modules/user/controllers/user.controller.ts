/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Request, Response } from 'express'

import CryptographyServices from '../../common/services/cryptography.services'

import UserServices from '../services/user.services'

class UserController {
  async getAllUsers(req: Request, res: Response) {
    const { limit = 5, page = 1, query = '' } = req.query

    const users = await UserServices.getUsers(
      limit as number,
      page as number,
      query as string,
    )
    res.status(200).json({ ok: true, users })
  }

  async addUser(req: Request, res: Response) {
    req.body.password = await CryptographyServices.encrypt(req.body.password)

    const { name, email, password, role } = req.body

    const newUser = await UserServices.addUser({ name, email, password, role })

    res.json({ ok: true, msg: 'User added succesfully', user: newUser })
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params

    const { _id, password, ...rest } = req.body

    if (password) {
      // Encrypt password
      rest.password = await CryptographyServices.encrypt(password)
    }

    const updatedUser = await UserServices.updateUserById(id, rest)

    res.json({
      ok: true,
      msg: `User with ID: ${id} succesfully updated`,
      user: updatedUser,
    })
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params

    const deletedUser = await UserServices.deleteUserById(id)

    res.json({
      ok: true,
      msg: `User with ID: ${id} succesfully deleted`,
      user: deletedUser,
    })
  }
}

export default new UserController()
