import _crudRepository from '../Repository/CrudRepository'
import _listController from './ListController'
import * as express from "express";

export default function (crudRepository: _crudRepository, option: any = null, router: express.Router = null) {
    router = router ?? express.Router();
    _listController(router, crudRepository, option);
    if (option === null || (!option.all && !option.crudAll)) {
        router.put('/', option.update ?? update)
        router.patch('/:id', option.patch ?? patch)
        router.post('/', option.create ?? create)
        router.delete('/:id', option.del ?? del)
    } else {
        if (option.crudAll) {
            router.put('/', option.crudAll, option.update ?? update)
            router.patch('/:id', option.crudAll, option.patch ?? patch)
            router.post('/', option.crudAll, option.create ?? create)
            router.delete('/:id', option.crudAll, option.del ?? del)
        }
        if (option.all && !option.crudAll) {
            router.put('/', option.all, option.update ?? update)
            router.patch('/:id', option.all, option.patch ?? patch)
            router.post('/', option.all, option.create ?? create)
            router.delete('/:id', option.all, option.del ?? del)
        }
    }

    async function del(req: any, res: any) {
        try {
            await crudRepository.del(req.params.id)
            res.status(204).send()
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function update(req: any, res: any) {
        try {
            const data = await crudRepository.update(req.body)
            res.status(200).json(data)
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function patch(req: any, res: any) {
        try {
            const data = await crudRepository.patch(req.params.id, req.body)
            res.status(200).json(data)
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function create(req: any, res: any) {
        try {
            const data = await crudRepository.insert(req.body)
            res.status(201).json(data)
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    return router
}
