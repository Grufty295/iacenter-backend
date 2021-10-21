import {
  HttpException,
  UnauthenticatedException,
  ForbiddenException,
} from '../../../exceptions'
import { Request, Response, NextFunction } from 'express'

import config from '../../../config/values.config'

import JwtServices from '../services/jwt.services'

class JwtMiddlewares {
  validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      try {
        const authorization = req.headers.authorization.split(' ')

        if (authorization[0] !== 'Bearer') {
          return next(new UnauthenticatedException())
        } else {
          res.locals.jwt = JwtServices.verifyJWT(authorization[1])

          return next()
        }
      } catch (err: unknown) {
        if (err instanceof HttpException)
          return res.status(err.status).json({ error: err.message })
      }
    } else {
      throw new UnauthenticatedException()
    }
  }

  async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers.refreshtoken) {
      try {
        res.locals.refresh = JwtServices.verifyJWT(
          req.headers.refreshtoken as string,
          config.JWT_REFRESH_SECRET,
        )
        return next()
      } catch (err: unknown) {
        return next(new ForbiddenException())
      }
    } else {
      return next(new UnauthenticatedException())
    }
  }
}
export default new JwtMiddlewares()
