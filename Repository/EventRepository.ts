import CRUDRepository from "../Core/Repository/CrudRepository";

export default class EventRepository extends CRUDRepository {
    async beforeInsert(data: any): Promise<any> {
        console.log("[EventRepository]beforeInsert ", data);
        let eventCopy = Object.assign({}, data);
        eventCopy.location = {
            "type": "Point", "coordinates": data.location
        };
        return super.beforeInsert(eventCopy);
    }
}
