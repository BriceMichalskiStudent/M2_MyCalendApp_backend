import * as mongoose from 'mongoose'
import { Schema } from 'mongoose'

/**
 * @typedef User
 */
const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  mail: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  followingIds: [{
    type: Schema.Types.ObjectId,
    required: true
  }],
  Roles: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Roles'
  }]
})

export default { UserModel: mongoose.model('Users', schema) }
