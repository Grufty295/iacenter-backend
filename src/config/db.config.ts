import Mongoose from 'mongoose'
import config from './values.config'
class DB {
  private connectionUri?: string
  private database: string

  constructor() {
    this.connectionUri = config.MONGODB_URI
    this.database = config.DB_NAME || 'test'
  }

  async connection(): Promise<void> {
    try {
      return await Mongoose.connect(
        `${this.connectionUri}/${this.database}`,
      ).then(() => console.log('MongoDB connected'))
    } catch (err: unknown) {
      console.error(err)
      throw new Error('Error in database connection')
    }
  }
}

export default DB
