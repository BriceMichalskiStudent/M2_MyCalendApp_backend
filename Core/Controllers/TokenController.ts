import CrudRepository from '../Repository/CrudRepository'
import ListController from '../Controllers/ListController'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as express from "express";
import _listController from "./ListController";
import AuthMiddleware from "../Middleware/AuthMiddleware";
import RoleCodes from "../../Commons/RoleCodes";
import UserRepository from "../Repository/UserRepository";

export default function (crudRepository: UserRepository) {
    const router = express.Router();
    _listController(router, crudRepository);
    router.post('/', create)
    router.delete('/disconnect', AuthMiddleware(RoleCodes.USER), disconnect)
    router.delete('/:id', AuthMiddleware(RoleCodes.ADMIN), del)

    async function disconnect(req: any, res: any) {
        try {
            const data: any = await crudRepository.get(req.user._id)
            data.token = null
            await crudRepository.update(data);
            res.status(204).send()
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function del(req: any, res: any) {
        try {
            const data: any = await crudRepository.get(req.user._id)
            data.token = null
            await crudRepository.update(data);
            res.status(204).send()
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function create(req: any, res: any) {
        try {
            const user: any = await crudRepository.getWithPassword({"mail": req.body.mail});

            if (!user) {
                res.status(400).json("Ce compte est introuvable.");
                return;
            }

            let valid: boolean;
            console.log(req.body.password, user.password)
            // eslint-disable-next-line prefer-const
            valid = await bcrypt.compare(req.body.password, user.password);

            if (!valid) {
                res.status(401).json("Mot de passe incorrect.");
                return;
            } else {
                const data: any = {};
                data.user = user;
                data.token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY ?? "oJtRnkPU9xk4yTc5dYgyWg1FQIEyy9yRjk7LFiuVell4PJ8YqwuFXaQ8UANc1ZdD", {expiresIn: 43200});

                res.status(201).json(data);
            }
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    return router
}
