import { Request, Response, NextFunction } from 'express'

import { Roles } from '../interfaces/common.role.enum'

class CommonRoleMiddleware {
  validateRoleExists(req: Request, res: Response, next: NextFunction) {
    const existingRole = req.body.role
    if (!Object.values(Roles).includes(existingRole)) {
      return res.status(400).json({ error: 'Invalid role' })
    } else {
      return next()
    }
  }

  validateSpecificRoleRequired(requiredRole: Roles) {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = res.locals.jwt.role

      if (userRole === requiredRole) {
        return next()
      } else {
        return res.status(403).json({
          error: 'You dont have the required role to make this action',
        })
      }
    }
  }

  validateOnlySameUserOrAdminCanMakeThisAction(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userRole = res.locals.jwt.role
    if (req.params && req.params.id && req.params.id === res.locals.jwt.id) {
      return next()
    } else {
      if (userRole === Roles.ADMIN_ROLE) {
        return next()
      } else {
        return res.status(403).json({
          error: 'You dont have the permission to make this action',
        })
      }
    }
  }
}

export default new CommonRoleMiddleware()
