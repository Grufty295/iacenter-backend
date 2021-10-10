import bcrypt from 'bcrypt'
import crypto from 'crypto'

class CryptographyServices {
  private salt: string

  constructor() {
    this.salt = bcrypt.genSaltSync(10)
  }

  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async decrypt(value: string, compareSync: string): Promise<boolean> {
    return await bcrypt.compare(value, compareSync)
  }

  randomString(): string {
    return crypto.randomBytes(40).toString('hex')
  }
}

export default new CryptographyServices()
