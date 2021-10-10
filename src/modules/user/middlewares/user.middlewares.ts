import { Request, Response, NextFunction } from 'express'

import UserServices from '../services/user.services'
import { IUserDoc } from '../interfaces/user.interface'

class UserMiddlewares {
  async validateSameEmailDoesntExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    let userWithExistingEmail: IUserDoc
    try {
      userWithExistingEmail = await UserServices.getUserByEmail(req.body.email)
      if (userWithExistingEmail) {
        return res
          .status(400)
          .send({ error: 'This email is already connected to an account' })
      } else {
        return next()
      }
    } catch (err: unknown) {
      console.log(err)
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
    if (req.body.role && req.body.role !== res.locals.jwt.role) {
      return res.status(403).json({ error: 'User cant change their role' })
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
      return res
        .status(404)
        .send({ error: `The user with ID: ${req.params.id} not found` })
    }
  }
}

export default new UserMiddlewares()
