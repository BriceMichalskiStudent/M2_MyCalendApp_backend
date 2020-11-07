import * as express from "express";
import CrudRepository from '../Repository/CrudRepository';
import ListController from './ListController';
import swaggerDoc from '../Swagger/Swagger';
import auth from '../Middleware/AuthMiddleware'

export default function (crudRepository: CrudRepository) {
    const router = ListController(crudRepository);
    router.put('/', update);
    router.post('/', create);
    router.delete('/:id', del);

    swaggerDoc.onGenerateSwaggerModelAndRouteApi(router, crudRepository.MongooseModel);

    async function del(req: any, res: any) {
        let data = await crudRepository.del(req.params.id);
        res.json(data);
    }

    async function update(req: any, res: any) {
        let data = await crudRepository.update(req.body);
        res.json(data);
    }

    async function create(req: any, res: any) {
        let data = await crudRepository.insert(req.body);
        res.json(data);
    }

    return router;
};
