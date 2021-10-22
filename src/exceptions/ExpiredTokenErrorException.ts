import HttpException from './BaseHttpException'

class ExpiredTokenException extends HttpException {
  constructor() {
    super(401, `Acces token already expire`)
  }
}

export default ExpiredTokenException
