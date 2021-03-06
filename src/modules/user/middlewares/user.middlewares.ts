import { Request, Response, NextFunction } from 'express'

import {
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '../../../exceptions'

import { Roles } from '../../common/interfaces/common.role.enum'

import UserServices from '../services/user.services'

class UserMiddlewares {
  async validateSameEmailDoesntExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userWithExistingEmail = await UserServices.getUserByEmail(
        req.body.email,
      )
      if (!userWithExistingEmail) {
        return next()
      } else {
        return res
          .status(400)
          .send({ error: 'This email is already connected to an account' })
      }
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  validateIdBelongsToSameUser(req: Request, res: Response, next: NextFunction) {
    if (res.locals.jwt.id === req.params.id) {
      return next()
    } else {
      return res.status(400).json({ error: 'Invalid ID' })
    }
  }

  userCantChangeRole(req: Request, res: Response, next: NextFunction) {
    if (res.locals.jwt.role === Roles.ADMIN_ROLE) return next()

    if (req.body.role && req.body.role !== res.locals.jwt.role) {
      return next(new ForbiddenException())
    } else {
      return next()
    }
  }

  validateEmailUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userWithExistingEmail = await UserServices.getUserByEmail(
        req.body.email,
      )
      if (
        !userWithExistingEmail ||
        userWithExistingEmail.name === res.locals.jwt?.name ||
        res.locals.jwt?.role === Roles.ADMIN_ROLE
      ) {
        return next()
      } else {
        return res
          .status(400)
          .send('This email is already connected to an account')
      }
    } catch (err: unknown) {
      if (err instanceof HttpException)
        return res.status(err.status).json({ error: err.message })
    }
  }

  async validateUserExists(req: Request, res: Response, next: NextFunction) {
    const existingUser = await UserServices.getUserById(req.params.id)
    if (existingUser) {
      next()
    } else {
      next(new NotFoundException('User'))
    }
  }
}

export default new UserMiddlewares()
