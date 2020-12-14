import CrudRepository from '../Repository/CrudRepository'
import ListController from '../Controllers/ListController'
import * as express from "express";
import _listController from "./ListController";
import AuthMiddleware from "../Middleware/AuthMiddleware";
import RoleCodes from "../../Commons/RoleCodes";

export default function (crudRepository: CrudRepository) {
    const router = express.Router();
    router.get('/current', AuthMiddleware(RoleCodes.USER), current)
    _listController(router, crudRepository, {
        all: AuthMiddleware(RoleCodes.USER)
    });
    router.put('/', AuthMiddleware(RoleCodes.USER), update)
    router.post('/', /* FileMiddleware.single("file"), */ create)
    router.patch('/:id', AuthMiddleware(RoleCodes.USER), patch)
    router.delete('/:id', AuthMiddleware(RoleCodes.ADMIN), del)

    async function current(req: any, res: any) {
        try {
            res.status(200).json(req.user)
        } catch (e) {
            console.error(e)
            res.status(500).json({message: "Une erreur est survenu"})
        }
    }

    async function del(req: any, res: any) {
        try {
            const data = await crudRepository.del(req.params.id)
            res.status(204).send()
        } catch (e) {
            console.error(e)
            res.status(500).json({message: "Une erreur est survenu"})
        }
    }

    async function update(req: any, res: any) {
        try {
            if (canUpdateUser(req, req.params.id)) {
                const data = await crudRepository.update(req.body)
                res.status(200).json(data)
            } else {
                res.status(403).send("Vous n'avez pas le droit de modifier l'element")
            }
        } catch (e) {
            console.error(e)
            res.status(500).json({message: "Une erreur est survenu"})
        }
    }

    async function patch(req: any, res: any) {
        try {
            if (canUpdateUser(req, req.params.id)) {
                const data = await crudRepository.patch(req.params.id, req.body)
                res.status(200).json(data)
            } else {
                res.status(403).send("Vous n'avez pas le droit de modifier l'element")
            }
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function create(req: any, res: any) {
        try {
            // GED.Save(req.file);
            const user = await crudRepository.getCustom({"mail": req.body.mail});

            if (user) {
                res.status(400).json({message: "Un utilisateur existe déjà avec cette adresse mail."});
                return;
            }

            const data = await crudRepository.insert(req.body);
            res.status(201).json(data);

        } catch (e) {
            console.error(e)
            res.status(500).json({message: "Une erreur est survenu"})
        }
    }

    function canUpdateUser(req: any, targetId: string): boolean {
        if (req.user.IsAdmin) {
            return true
        } else if (req.user._id === targetId) {
            return true
        }
        return false
    }

    return router
}
