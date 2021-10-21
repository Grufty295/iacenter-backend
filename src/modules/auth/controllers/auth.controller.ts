import { Request, Response } from 'express'

import { HttpException } from '../../../exceptions'

import config from '../../../config/values.config'

import { IUserDoc } from '../../user/interfaces/user.interface'

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
        id: user.id,
        name: user.name,
        role: user.role,

        token,
        refreshToken,
      })
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  async signup(req: Request, res: Response) {
    try {
      req.body.password = await CryptographyServices.encrypt(req.body.password)

      const { name, email, password, role } = req.body

      await UserServices.addUser({
        name,
        email,
        password,
        role,
      })

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
        id: user.id,
        name: user.name,
        role: user.role,

        token,
        refreshToken,
      })
    } catch (err: unknown) {
      return res
        .status(500)
        .json({ error: 'Something went wrong, talk to de administrator' })
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
}

export default new AuthController()
