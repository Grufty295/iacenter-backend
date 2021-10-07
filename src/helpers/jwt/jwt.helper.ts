import jwt from 'jsonwebtoken'

const generateJWT = (uid: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const payload = { uid }

    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '4h' },
      (err, token = '') => {
        if (err) {
          console.log(err)
          reject(new Error('Token generation failed'))
        } else {
          resolve(token)
        }
      },
    )
  })
}

export default { generateJWT }
