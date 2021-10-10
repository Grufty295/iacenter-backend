/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express'

// import { IUserDoc } from '../interfaces/user.interface'

import CryptographyServices from '../../common/services/cryptography.services'
import UserServices from '../services/user.services'

class UserController {
  async getAllUsers(req: Request, res: Response) {
    const { limit = 5, page = 1, query = '' } = req.query

    try {
      const users = await UserServices.getUsers({
        limit: limit as number,
        page: page as number,
        query: query as string,
      })
      res.status(200).json(users)
    } catch (err: unknown) {
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to de administrator' })
    }
  }

  async addUser(req: Request, res: Response) {
    try {
      req.body.password = await CryptographyServices.encrypt(req.body.password)

      const { name, email, password, role } = req.body

      await UserServices.addUser({
        name,
        email,
        password,
        role,
      })

      return res.status(201).json({ msg: 'User regsitration was succesfull' })
    } catch (err: unknown) {
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to de administrator' })
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    const { _id, password, ...rest } = req.body

    try {
      if (password) {
        // Encrypt password
        rest.password = await CryptographyServices.encrypt(password)
      }

      const updatedUser = await UserServices.updateUserById(id, { ...rest })

      return res.json(updatedUser)
    } catch (err: unknown) {
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to de administrator' })
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params

    try {
      await UserServices.deleteUserById(id)

      res.json({ msg: 'User was succesfully deleted' })
    } catch (err: unknown) {
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to de administrator' })
    }
  }
}

export default new UserController()
