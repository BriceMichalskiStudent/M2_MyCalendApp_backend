import CRUDRepository from './CrudRepository'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import IocManager from "../IocManager";
import RoleCodes from "../../Commons/RoleCodes";
import EventRepository from "../../Repository/EventRepository";

export default class UserRepository extends CRUDRepository {
    constructor(MongooseModel: mongoose.Model<mongoose.Document>, getPopulates: Array<any> = [], listPopulates: Array<any> = []) {
        super(MongooseModel, getPopulates, listPopulates)
    }
    
    async getWithPassword(where: any) {
        const result = this.MongooseModel.findOne(where).select('+password')
        for (const populate of this.getPopulates) {
            const getPopulate = this.reconstructPopulate(populate)
            result.populate(getPopulate)
        }
        const data = await result.exec()
        return this.afterGet(data)
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

    async beforeUpdate (data: any): Promise<any> {
        if(data.password){
            data.password = bcrypt.hashSync(data.password, 10)
        }
        return data
    }

    async afterGet(result: any): Promise<any> {
        result = result.toObject()
        const eventRepository: EventRepository = IocManager.GetInstance().GetSingleton("EventRepository")
        result.events = (await eventRepository.list({"followers":result._id})).map(e => e._id)

        return result
    }

    async afterGetWithEvents(result: any): Promise<any> {
        result = result.toObject()
        const eventRepository: EventRepository = IocManager.GetInstance().GetSingleton("EventRepository")
        result.events = (await eventRepository.list({"followers":result._id}))

        return result
    }

    async getWithEvents(id: string, withPopulate = true) {
        console.log("getWithEvents")
        const result = this.MongooseModel.findById(id)
        if(withPopulate){
            for (const populate of this.getPopulates) {
                const getPopulate = this.reconstructPopulate(populate)
                console.log("getPopulate : ", getPopulate)
                result.populate(getPopulate)
            }
        }

        let values = await result.exec()
        values = await this.afterGetWithEvents(values)
        return values
    }
}
