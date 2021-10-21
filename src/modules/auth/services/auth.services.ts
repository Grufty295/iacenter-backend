import { IUserDoc } from '../../user/interfaces/user.interface'

import CryptographyServices from '../../common/services/cryptography.services'

class AuthServices {
  async checkIfPasswordsIdenticals(user: IUserDoc, passwordToCheck: string) {
    try {
      return await CryptographyServices.decrypt(passwordToCheck, user.password)
    } catch (err: unknown) {
      throw Error()
    }
  }
}

export default new AuthServices()
