import { Request, Response, NextFunction } from 'express'

import UserServices from '../../user/services/user.services'
import AuthServices from '../services/auth.services'

class AuthMiddlewares {
  async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body

    try {
      const existingUser = await UserServices.getUserByEmail(email)

      if (existingUser) {
        const validPassword = await AuthServices.checkIfPasswordsIdenticals(
          existingUser,
          password,
        )

        if (validPassword) {
          req.body = {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
          }
          return next()
        }
      }
      return res.status(400).json({ error: 'Invalid email and/or password' })
    } catch (err: unknown) {
      console.log(err)
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to the administrator' })
    }
  }
}

export default new AuthMiddlewares()
