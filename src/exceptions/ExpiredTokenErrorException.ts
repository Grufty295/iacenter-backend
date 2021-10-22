import HttpException from './BaseHttpException'

class ExpiredTokenException extends HttpException {
  constructor() {
    super(401, `Access token already expire`)
  }
}

export default ExpiredTokenException
