import HttpException from './BaseHttpException'

class UnauthenticatedException extends HttpException {
  constructor() {
    super(401, `Unauthenticated user`)
  }
}

export default UnauthenticatedException
