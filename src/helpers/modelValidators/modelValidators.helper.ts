import User from '../../modules/user/models/user.model'
import Role from '../../modules/user/models/role.model'

const isValidRole = async (role = ''): Promise<void> => {
  const roleExists = await Role.findOne({ role })
  if (!roleExists) throw new Error('Invalid role')
}

const existingEmail = async (email = ''): Promise<void> => {
  const emailExists = await User.findOne({ email })
  if (emailExists)
    throw new Error('This email is already connected to an account')
}

export { isValidRole, existingEmail }
