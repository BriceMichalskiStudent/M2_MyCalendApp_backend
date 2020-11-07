import * as mongoose from 'mongoose'
import ListRepository from './ListRepository'

export default class CRUDRepository extends ListRepository {

    constructor(MongooseModel: mongoose.Model<mongoose.Document>, getPopulates: Array<any> = [], listPopulates: Array<any> = []) {
        super(MongooseModel, getPopulates, listPopulates);
    }

    public async del(id: string) {
        await this.beforeDelete(id);
        let result: any = this.MongooseModel.findByIdAndDelete(id);
        result = await this.afterDelete(result);
        return result;
    }

    public async update(model: object) {
        const reworkedModel = await this.beforeUpdate(model);
        let result: any = await this.MongooseModel.findOneAndUpdate({_id: reworkedModel._id}, reworkedModel, {new: true});
        result = await this.afterUpdate(model, result);
        return result
    }

    public async insert(model: object) {
        const reworkedModel = await this.beforeInsert(model);
        let result: object = await new this.MongooseModel(reworkedModel).save();
        result = await this.afterInsert(model, result);
        return result;
    }

    async beforeDelete(id: string) {
    }

    async afterDelete(data: any): Promise<any> {
        return data;
    }

    async beforeUpdate(data: any): Promise<any> {
        return data;
    }

    async afterUpdate(model: any, result: any): Promise<any> {
        return result;
    }

    async beforeInsert(data: any): Promise<any> {
        return data;
    }

    async afterInsert(model: any, result: any): Promise<any> {
        return result;
    }

}
