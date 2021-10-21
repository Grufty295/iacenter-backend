import HttpException from './BaseHttpException'

class UnauthenticatedException extends HttpException {
  constructor() {
    super(401, `User authentication failed`)
  }
}

export default UnauthenticatedException
