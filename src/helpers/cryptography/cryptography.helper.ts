import bcrypt from 'bcrypt'

class Crypto {
  private salt: number | string

  constructor() {
    this.salt = bcrypt.genSaltSync(10)
  }

  async encrypt(value: string): Promise<string> {
    return await bcrypt.hashSync(value, this.salt)
  }

  async decrypt(value: string, compareSync: string): Promise<boolean> {
    return await bcrypt.compareSync(value, compareSync)
  }
}

export default Crypto
