import * as mongoose from 'mongoose'
import { Schema } from 'mongoose'
import RoleCodes from '../../Commons/RoleCodes'

/**
 * @typedef Role
 */
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
})

const model = mongoose.model('Roles', schema)

const ensureRoleCreated = async () => {
  if ((await model.findOne({ code: RoleCodes.ADMIN })) === null) {
    await new model({ code: RoleCodes.ADMIN, name: 'Administrateur' }).save()
  }
  if ((await model.findOne({ code: RoleCodes.USER })) === null) {
   await new model({ code: RoleCodes.USER, name: 'Utilisateur' }).save()
  }
}

export default { RoleModel: model, EnsureEntities: ensureRoleCreated }
