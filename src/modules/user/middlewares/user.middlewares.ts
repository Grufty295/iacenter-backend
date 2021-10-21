import { Request, Response, NextFunction } from 'express'

import {
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '../../../exceptions'

import { IUserDoc } from '../interfaces/user.interface'

import { Roles } from '../../common/interfaces/common.role.enum'

import UserServices from '../services/user.services'

class UserMiddlewares {
  async validateSameEmailDoesntExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let userWithExistingEmail: IUserDoc
    try {
      userWithExistingEmail = await UserServices.getUserByEmail(req.body.email)
      if (
        !userWithExistingEmail ||
        userWithExistingEmail.name === res.locals.jwt.name ||
        res.locals.jwt.role === Roles.ADMIN_ROLE
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
      // return res.status(403).json({ error: 'User cant change their role' })
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
    if (req.body.email) {
      return await this.validateSameEmailDoesntExists(req, res, next)
    } else {
      return next()
    }
  }

  async validateUserExists(req: Request, res: Response, next: NextFunction) {
    const existingUser = await UserServices.getUserById(req.params.id)
    if (existingUser) {
      next()
    } else {
      next(new NotFoundException('User'))
      // return res
      //   .status(404)
      //   .send({ error: `The user with ID: ${req.params.id} not found` })
    }
  }
}

export default new UserMiddlewares()
