import { Schema, model } from 'mongoose'
import { IRole } from '../interfaces/role.interface'

const RoleSchema = new Schema<IRole>({
  role: { type: String, required: true },
})

export default model<IRole>('Role', RoleSchema)
