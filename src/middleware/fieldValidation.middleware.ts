/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

function fieldValidation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next()
}

export default fieldValidation
