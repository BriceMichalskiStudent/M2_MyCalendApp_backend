import CrudRepository from '../Repository/CrudRepository'
import ListController from '../Controllers/ListController'
import * as express from "express";
import _listController from "./ListController";
import AuthMiddleware from "../Middleware/AuthMiddleware";
import RoleCodes from "../../Commons/RoleCodes";
import IocManager from "../IocManager";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';

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
            console.log(req.files ? req.files.img : null);
            const userToSave = JSON.parse(req.body.user);
            const user = await crudRepository.getCustom({"mail": userToSave.mail});
            if (!userToSave) {
                res.status(400).json({message: "Des informations sur l'utilisateur sont manquantes"});
                return;
            }
            if (user) {
                res.status(400).json({message: "Un utilisateur existe déjà avec cette adresse mail."});
                return;
            }

            if (!req.files || !req.files.img) {
                const userCreated = await crudRepository.insert(userToSave);
                res.status(201).json(userCreated);
            } else {
                const s3 = new (IocManager.GetInstance().GetSingleton("AWS")).S3();
                const fileName = process.env.FILE_REPOSITORY + "/" + uuidv4() + ".webp";
                const fileType = req.files.img.mimetype;

                const imageSharp = sharp(req.files.img.data);
                const buffer = await imageSharp.webp().toBuffer();

                const s3Params = {
                    Bucket: process.env.S3_BUCKET,
                    Key: fileName,
                    Expires: 60,
                    ContentType: fileType,
                    ACL: 'public-read',
                    Body: buffer
                };

                s3.putObject(s3Params, async (err, data) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({message: "Une erreur est survenu"})
                    } else {
                        userToSave.imgUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
                        const userCreated = await crudRepository.insert(userToSave);
                        res.status(201).json(userCreated);
                    }
                });
            }

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
