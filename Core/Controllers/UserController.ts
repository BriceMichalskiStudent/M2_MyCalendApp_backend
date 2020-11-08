import * as express from "express";
import CrudRepository from '../Repository/CrudRepository';
import ListController from '../Controllers/ListController';
import swaggerDoc from "../Swagger/Swagger";
import auth from '../Middleware/AuthMiddleware'

// import FileMiddleware from '../Core/FileMiddleware';
// import GED from '../Core/GED';

export default function (crudRepository: CrudRepository) {
    const router = ListController(crudRepository);
    router.put('/', update);
    router.post('/', /*FileMiddleware.single("file"),*/ create);
    router.delete('/:id', del);

    // swaggerDoc.onGenerateSwaggerModelAndRouteApi(router, crudController.MongooseModel);

    async function del(req: any, res: any) {
        let data = await crudRepository.del(req.params.id);
        res.json(data);
    }

    async function update(req: any, res: any) {
        let data = await crudRepository.update(req.body);
        res.json(data);
    }

    async function create(req: any, res: any) {
        console.log("file : ", req.file);
        // GED.Save(req.file);
        let user = await crudRepository.getCustom({"mail" : req.body.mail});

        if(user) {
            res.status(400).json("Un utilisateur existe déjà avec cette adresse mail.");
            return;
        }

        let data = await crudRepository.insert(req.body);
        res.json(data);
    }

    swaggerDoc.onGenerateSwaggerModelAndRouteApi(router, crudRepository.MongooseModel);
    return router;
};
