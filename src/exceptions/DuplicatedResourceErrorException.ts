import HttpException from './BaseHttpException'

class DuplicatedResourceException extends HttpException {
  constructor() {
    super(400, `This resource already exists'`)
  }
}

export default DuplicatedResourceException
