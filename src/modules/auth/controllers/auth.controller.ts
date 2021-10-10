import { Request, Response } from 'express'

import config from '../../../config/values.config'

import { IUserDoc } from '../../user/interfaces/user.interface'

import AuthServices from '../services/auth.services'
import CryptographyServices from '../../common/services/cryptography.services'
import JwtServices from '../services/jwt.services'
import UserServices from '../../user/services/user.services'

class AuthController {
  async login(req: Request, res: Response) {
    const { email } = req.body

    try {
      const user = await UserServices.getUserByEmail(email)

      const token = JwtServices.generateJWT(user.id, user.email, user.role)
      const refreshToken = JwtServices.generateJWT(
        user.id,
        user.email,
        user.role,
        config.JWT_REFRESH_SECRET,
        config.JWT_REFRESH_EXPIRATION,
      )

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        token,
        refreshToken,
      })
    } catch (err: unknown) {
      console.log(err)

      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to the administrator' })
    }
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.headers.refreshtoken as string
    let user: IUserDoc

    if (!refreshToken) {
      return res
        .status(400)
        .json({ msg: 'Something went wrong, refresh token is required' })
    }

    try {
      const verifiedRefreshToken = JwtServices.verifyJWT(
        refreshToken,
        config.JWT_REFRESH_SECRET,
      )

      const { email } = verifiedRefreshToken as IUserDoc

      user = await UserServices.getUserByEmail(email)
    } catch (err: unknown) {
      return res.status(400).json({ msg: 'Something went wrong, Invalid user' })
    }

    const token = JwtServices.generateJWT(user.id, user.email, user.role)
    return res.status(200).json({ token })
  }

  async changePassword(req: Request, res: Response) {
    const { email } = res.locals.jwt
    const { id } = req.params
    const { oldPassword, newPassword } = req.body

    try {
      const existingUser = await UserServices.getUserByEmail(email)

      if (existingUser) {
        const validPassword = await AuthServices.checkIfPasswordsIdenticals(
          existingUser,
          oldPassword,
        )

        if (validPassword) {
          const hashedPassword = await CryptographyServices.encrypt(newPassword)

          await UserServices.updateUserById(id, { password: hashedPassword })

          return res
            .status(200)
            .json({ msg: 'User password succesfully updated' })
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

export default new AuthController()
