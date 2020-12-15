import CrudRepository from "../Core/Repository/CrudRepository";
import CRUDController from "../Core/Controllers/CRUDController";
import * as express from "express";

export default function (crudRepository: CrudRepository, eventRepository: CrudRepository, option: any = null) {
    const router = express.Router();
    if (option === null) {
        router.get('event/:id', getByEvent)
        option = {
            create
        }
    } else {
        if (option.listAll) {
            router.get('/event/:id', option.listAll, getByEvent)
        }
        option.create = create;
    }

    CRUDController(crudRepository, option, router);

    async function getByEvent(req: any, res: any) {
        try {
            const data = await eventRepository.get(req.params.id)
            res.status(200).json(data)
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function create(req: any, res: any) {
        try {
            const event: any = await eventRepository.get(req.body.eventId)
            const post = req.body
            post.creator = req.user._id
            const data: any = await crudRepository.insert(post)
            event.posts.push(data._id)
            event.save()
            res.status(201).json(data)
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    return router;
}