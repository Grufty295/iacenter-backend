import Mongoose from 'mongoose'

class DB {
  private connectionUri?: string
  private database: string

  constructor() {
    this.connectionUri = process.env.MONGODB_CNN
    this.database = process.env.DB_NAME || 'test'
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
