import HttpException from './BaseHttpException'

class ForbiddenException extends HttpException {
  constructor() {
    super(403, `You dont have the permission to make this action`)
  }
}

export default ForbiddenException
