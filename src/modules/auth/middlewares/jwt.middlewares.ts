import { Request, Response, NextFunction } from 'express'

import config from '../../../config/values.config'

import JwtServices from '../services/jwt.services'

class JwtMiddlewares {
  validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      try {
        const authorization = req.headers.authorization.split(' ')

        if (authorization[0] !== 'Bearer') {
          return res.status(401).send()
        } else {
          res.locals.jwt = JwtServices.verifyJWT(authorization[1])

          next()
        }
      } catch (err: unknown) {
        return res.status(403).json({ err })
      }
    } else {
      return res.status(401).send()
    }
  }

  async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers.refreshtoken) {
      try {
        res.locals.refresh = JwtServices.verifyJWT(
          req.headers.refreshtoken as string,
          config.JWT_REFRESH_SECRET,
        )
        next()
      } catch (err: unknown) {
        console.log(err)

        return res.status(403).json({ msg: 'bad verification' })
      }
    } else {
      return res.status(401).send()
    }
  }
}
export default new JwtMiddlewares()
