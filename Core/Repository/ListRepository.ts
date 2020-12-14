import * as mongoose from 'mongoose'
import PopulateModel from '../Models/PopulateModel'

export default class ListRepository {
    MongooseModel: mongoose.Model<mongoose.Document>;
    getPopulates: Array<any>;
    listPopulates: Array<any>;

    constructor(MongooseModel: mongoose.Model<mongoose.Document>, getPopulates: Array<any> = [], listPopulates: Array<any> = []) {
        this.getPopulates = getPopulates
        this.listPopulates = listPopulates
        this.MongooseModel = MongooseModel
    }

    reconstructPopulate(object: any): PopulateModel {
        const result = new PopulateModel(object.name, [])

        if (object.childs) {
            for (const child of object.childs) {
                result.populate.push(this.reconstructPopulate(child))
            }
        }

        return result
    }

    async list() {
        let result = this.MongooseModel.find()
        for (const populate of this.listPopulates) {
            const getPopulate = this.reconstructPopulate(populate)
            result.populate(getPopulate)
        }

        let values = await result.exec()
        values = await this.afterList(values)
        return values
    }

    async get(id: string) {
        let result = this.MongooseModel.findById(id)
        for (const populate of this.getPopulates) {
            const getPopulate = this.reconstructPopulate(populate)
            result.populate(getPopulate)
        }

        let values = await result.exec()
        values = await this.afterGet(values)
        return values
    }

    async getCustom(where: any) {
        const result = this.MongooseModel.findOne(where)
        for (const populate of this.getPopulates) {
            const getPopulate = this.reconstructPopulate(populate)
            result.populate(getPopulate)
        }

        let values = await result.exec()
        values = await this.afterGetCustom(values)
        return values
    }

    async afterList(result: any): Promise<any> {
        return result
    }

    async afterGet(result: any): Promise<any> {
        return result
    }

    async afterGetCustom(result: any): Promise<any> {
        return result
    }
}
