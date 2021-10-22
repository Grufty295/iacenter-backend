import {
  HttpException,
  UnauthenticatedException,
  // ForbiddenException,
} from '../../../exceptions'
import { Request, Response, NextFunction } from 'express'

import config from '../../../config/values.config'

import JwtServices from '../services/jwt.services'

class JwtMiddlewares {
  validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization) {
        const authorization = req.headers.authorization.split(' ')

        if (authorization[0] !== 'Bearer') {
          throw new UnauthenticatedException()
        } else {
          res.locals.jwt = JwtServices.verifyJWT(authorization[1])
          return next()
        }
      } else {
        throw new UnauthenticatedException()
      }
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.refreshtoken) {
        res.locals.refresh = JwtServices.verifyJWT(
          req.headers.refreshtoken as string,
          config.JWT_REFRESH_SECRET,
        )
        return next()
      } else {
        throw new UnauthenticatedException()
      }
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }
}
export default new JwtMiddlewares()
