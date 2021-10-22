/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response } from 'express'

import { HttpException } from '../../../exceptions'

import CryptographyServices from '../../common/services/cryptography.services'
import UserServices from '../services/user.services'

class UserController {
  async getAllUsers(req: Request, res: Response) {
    const { limit = 5, query = '', sort = 'name:1', offset = 0 } = req.query

    const sortParts = sort as string

    const [sortField, sortOrder] = sortParts.split(':')

    try {
      const users = await UserServices.getUsers({
        limit: limit as number,
        sort: { [sortField]: sortOrder },
        offset: offset as number,
        query: query as string,
      })
      res.status(200).json(users)
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  async addUser(req: Request, res: Response) {
    const { name, email, password, role } = req.body

    try {
      req.body.password = await CryptographyServices.encrypt(req.body.password)

      await UserServices.addUser({
        name,
        email,
        password,
        role,
      })

      return res.status(201).json({ msg: 'User registration was succesfull' })
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    const { _id, password, ...rest } = req.body

    try {
      if (password) {
        rest.password = await CryptographyServices.encrypt(password)
      }

      const updatedUser = await UserServices.updateUserById(id, { ...rest })

      return res.json(updatedUser)
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params

    try {
      await UserServices.deleteUserById(id)

      res.json({ msg: 'User was succesfully deleted' })
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }
}

export default new UserController()
