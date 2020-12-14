import _crudRepository from '../Repository/CrudRepository'
import _listController from './ListController'
import * as express from "express";

export default function (crudRepository: _crudRepository, option: any = null) {
    const router = express.Router();
    _listController(router, crudRepository, option);
    if (option === null) {
        router.put('/', update)
        router.patch('/:id', patch)
        router.post('/', create)
        router.delete('/:id', del)
    } else {
        if (option.crudAll) {
            router.put('/', option.crudAll, update)
            router.patch('/:id', option.crudAll, patch)
            router.post('/', option.crudAll, create)
            router.delete('/:id', option.crudAll, del)
        }
        if (option.all && !option.crudAll) {
            router.put('/', option.all, update)
            router.patch('/:id', option.all, patch)
            router.post('/', option.all, create)
            router.delete('/:id', option.all, del)
        }
    }

    async function del(req: any, res: any) {
        try {
            await crudRepository.del(req.params.id)
            res.status(204).send()
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function update(req: any, res: any) {
        try {
            const data = await crudRepository.update(req.body)
            res.status(200).json(data)
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function patch(req: any, res: any) {
        try {
            const data = await crudRepository.patch(req.params.id, req.body)
            res.status(200).json(data)
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function create(req: any, res: any) {
        try {
            const data = await crudRepository.insert(req.body)
            res.status(201).json(data)
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    return router
}
