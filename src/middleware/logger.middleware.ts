import { Request, Response, NextFunction } from 'express'

function loggerMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const { url, method, body, headers } = request

  console.info('[LOG]', { url, method, body, headers })
  next()
}

export default loggerMiddleware
