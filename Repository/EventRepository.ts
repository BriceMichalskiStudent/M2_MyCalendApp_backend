import CRUDRepository from "../Core/Repository/CrudRepository";

export default class EventRepository extends CRUDRepository {

    async join(eventId: string, userId: string) {
        const result = this.MongooseModel.findOne({_id: eventId})
        const value: any = await result.exec();
        value.followers = value.followers ?? [];
        const index = value.followers.indexOf(userId);
        if (index === -1) {
            value.followers.push(userId)
        }
        await this.MongooseModel.findOneAndUpdate({_id: eventId}, value, {new: true})
    }

    async unjoin(eventId: string, userId: string) {
        console.log("unjoin")
        const result: any = this.MongooseModel.findOne({_id: eventId})
        const value: any = await result.exec();
        value.followers = value.followers ?? [];

        const index = value.followers.indexOf(userId);
        if (index > -1) {
            value.followers.splice(index, 1);
        }

        console.log(value.followers)
        await this.MongooseModel.findOneAndUpdate({_id: eventId}, value, {new: true})
    }

    // Override
    async list(where: any, withPopulate = true) {
        where = where ?? {};
        console.log(where);
        const result = this.MongooseModel.find(where)
        if (withPopulate) {
            for (const populate of this.listPopulates) {
                const getPopulate = this.reconstructPopulate(populate)
                result.populate(getPopulate)
            }
        }
        result.sort({dateStart: 1})
        let values = await result.exec()
        values = await this.afterList(values)
        return values
    }
}
