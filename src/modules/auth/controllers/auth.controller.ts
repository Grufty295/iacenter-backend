import { Request, Response } from 'express'

import Crypto from '../../../helpers/cryptography/cryptography.helper'
import jwtHelper from '../../../helpers/jwt/jwt.helper'

import User from '../../user/models/user.model'

const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (!existingUser)
      return res
        .status(400)
        .json({ ok: false, msg: 'Invalid email and/or password - mail' })

    if (existingUser.state === false)
      return res
        .status(400)
        .json({ ok: false, msg: 'Invalid email and/or password - state' })

    const validPassword = await Crypto.decrypt(password, existingUser.password)
    if (!validPassword)
      return res
        .status(400)
        .json({ ok: false, msg: 'Invalid email and/or password - password' })

    const token = await jwtHelper.generateJWT(existingUser.id)

    return res.status(200).json({ existingUser, token })
  } catch (error: unknown) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong, talk to de administrator',
    })
  }
}

export default { login }
