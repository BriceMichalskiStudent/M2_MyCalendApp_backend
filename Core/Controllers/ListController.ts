import * as express from 'express'
import ListRepository from '../Repository/ListRepository'

export default function (router: any, listRepository: ListRepository, option: any = null) {
    if (option === null) {
        router.get('/', list)
        router.get('/:id', get)
    } else {
        if(option.list){
            router.get('/', option.list, list)
        }
        if(option.get){
            router.get('/:id', option.get, get)
        }

        if (option.listAll && !option.list && !option.get) {
            router.get('/', option.listAll, list)
            router.get('/:id', option.listAll, get)
        }

        if (option.all && !option.listAll && !option.list && !option.get) {
            router.get('/', option.all, list)
            router.get('/:id', option.all, get)
        }
    }

    async function list(req: any, res: any) {
        try {
            const data = await listRepository.list()
            res.status(200).json(data)
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function get(req: any, res: any) {
        try {
            const data = await listRepository.get(req.params.id)
            res.status(200).json(data)
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    return router
}
