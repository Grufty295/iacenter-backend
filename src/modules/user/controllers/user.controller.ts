/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response } from 'express'
import { FilterQuery, CustomLabels, PaginateOptions } from 'mongoose'

import Crypto from '../../../helpers/cryptography/cryptography.helper'
import { IUser } from '../interfaces/user.interface'
import User from '../models/user.model'

const crypto = new Crypto()

const getAllUsers = async (req: Request, res: Response) => {
  const { limit = 5, page = 1, query = '' } = req.query

  const condition: FilterQuery<IUser> = {
    $and: [
      {
        $or: [
          { name: { $regex: query.toString() } },
          { email: { $regex: query.toString() } },
        ],
      },
    ],
  }

  const customLabels: CustomLabels = {
    totalDocs: 'userCount',
    docs: 'usersList',
  }

  const options: PaginateOptions = {
    limit: parseInt(limit.toString()),
    page: parseInt(page.toString()),
    customLabels,
  }

  const users = await User.paginate(condition, options)
  res.status(200).json({ ok: true, users })
}

// const getOneUser = (req: Request, res: Response) => {}

const addUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body
  const newUser = new User({ name, email, password, role })

  // Encrypt password
  newUser.password = await crypto.encrypt(password)

  await newUser.save()

  res.json({ ok: true, msg: 'User added succesfully', user: newUser })
}

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, password, ...rest } = req.body

  if (password) {
    // Encrypt password
    rest.password = await crypto.encrypt(password)
  }

  const updatedUser = await User.findByIdAndUpdate(id, rest)

  res.json({
    ok: true,
    msg: `User with ID: ${id} succesfully updated`,
    user: updatedUser,
  })
}

// const deleteUser = (req: Request, res: Response) => {}

export default {
  getAllUsers,
  //   getOneUser,
  addUser,
  updateUser,
  //   deleteUser,
}
