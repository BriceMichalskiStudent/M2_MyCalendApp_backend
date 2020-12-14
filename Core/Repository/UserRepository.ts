import CRUDRepository from './CrudRepository'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import IocManager from "../IocManager";
import RoleCodes from "../../Commons/RoleCodes";

export default class UserRepository extends CRUDRepository {
    constructor(MongooseModel: mongoose.Model<mongoose.Document>, getPopulates: Array<any> = [], listPopulates: Array<any> = []) {
        super(MongooseModel, getPopulates, listPopulates)
    }
    
    async getWithPassword(where: any) {
        const result = this.MongooseModel.findOne(where)
        for (const populate of this.getPopulates) {
            const getPopulate = this.reconstructPopulate(populate)
            result.populate(getPopulate)
        }
        return await result.exec()
    }

    async beforeInsert(data: any): Promise<any> {
        const copyData = Object.assign({}, data)
        copyData.password = bcrypt.hashSync(copyData.password, 10)
        copyData.Roles = []
        const crudReprository: CRUDRepository = IocManager.GetInstance().GetSingleton("RoleCrudRepository")
        const role = await crudReprository.getCustom({code: RoleCodes.USER})
        copyData.Roles.push(role["_id"])

        return copyData
    }

    async afterDelete (data: any): Promise<any> {
        data.password = undefined;
        return data
    }

    async afterUpdate (model: any, result: any): Promise<any> {
        result.password = undefined;
        return result
    }

    async afterPatch (model: any, result: any): Promise<any> {
        result.password = undefined;
        return result
    }

    async afterInsert (model: any, result: any): Promise<any> {
        result.password = undefined;
        return result
    }

    async afterGet(result: any): Promise<any> {
        result.password = undefined;
        return super.afterGet(result);
    }

    async afterGetCustom(result: any): Promise<any> {
        result.password = undefined;
        return super.afterGet(result);
    }

    async afterList(result: any): Promise<any> {
        for (const elem of result){
            elem.password = undefined;
        }
        return result
    }
}
