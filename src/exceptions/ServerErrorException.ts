import HttpException from './BaseHttpException'

class ServerErrorException extends HttpException {
  constructor() {
    super(500, `Something went wrong, talk to the administrator`)
  }
}

export default ServerErrorException
