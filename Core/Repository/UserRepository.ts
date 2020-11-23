import CRUDRepository from './CrudRepository'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

export default class UserRepository extends CRUDRepository {
  constructor (MongooseModel: mongoose.Model<mongoose.Document>, getPopulates: Array<any> = [], listPopulates: Array<any> = []) {
    super(MongooseModel, getPopulates, listPopulates)
  }

  async beforeInsert (data: any): Promise<any> {
    console.log('beforeInsert data: ', data)
    const copyData = Object.assign({}, data)
    copyData.password = bcrypt.hashSync(copyData.password, 10)
    console.log('beforeInsert copyData.password: ', copyData.password)
    return copyData
  }
}
