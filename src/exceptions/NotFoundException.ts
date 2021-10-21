import HttpException from './BaseHttpException'

class NotFoundException extends HttpException {
  constructor(resource: string) {
    super(404, `Any resource of type '${resource}' was found'`)
  }
}

export default NotFoundException
