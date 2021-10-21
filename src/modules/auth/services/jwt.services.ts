import jwt from 'jsonwebtoken'
import config from '../../../config/values.config'
import {
  UnauthenticatedException,
  ServerErrorException,
} from '../../../exceptions'

class JwtServices {
  generateJWT(
    id: string,
    email: string,
    role: string,
    secret = config.JWT_SECRET,
    expiration = config.JWT_EXPIRATION,
  ) {
    const payload = { id, email, role }

    try {
      const token = jwt.sign(payload, secret as string, {
        expiresIn: expiration as string,
      })

      return token
    } catch (err: unknown) {
      throw new ServerErrorException()
    }
  }

  verifyJWT(token: string, secret = config.JWT_SECRET) {
    try {
      return jwt.verify(token, secret as string)
    } catch (err: unknown) {
      throw new UnauthenticatedException()
    }
  }
}

export default new JwtServices()
