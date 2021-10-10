import { Request, Response, NextFunction } from 'express'

function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { url, method, body, headers } = req

  console.info('[LOG]', { url, method, body, headers })
  next()
}

export default loggerMiddleware
