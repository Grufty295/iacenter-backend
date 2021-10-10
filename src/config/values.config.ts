import dotenv from 'dotenv'
dotenv.config()

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_CNN,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
}

export default config
