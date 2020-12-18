import CrudRepository from "../Core/Repository/CrudRepository";
import CRUDController from "../Core/Controllers/CRUDController";
import * as express from "express";
import IocManager from "../Core/IocManager";
import sharp from "sharp";
import { v4 as uuidv4 } from 'uuid';
import EventRepository from "../Repository/EventRepository";

export default function (crudRepository: EventRepository, option: any = null) {
    const router = express.Router();

    option = option ?? {};

    option.create = create;
    option.update = update;

    router.put('/:eventId/join/:userId', join)
    router.put('/:eventId/unjoin/:userId', unjoin)

    CRUDController(crudRepository, option, router);

    async function join(req: any, res: any){
        try {
            const data = await crudRepository.join(req.params.eventId, req.params.userId)
            res.status(200).json(data)
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function unjoin(req: any, res: any){
        try {
            const data = await crudRepository.unjoin(req.params.eventId, req.params.userId)
            res.status(200).json(data)
        } catch (e){
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    async function create(req: any, res: any) {
        try {
            console.log(req.files ? req.files.img : null);
            const eventToSave = JSON.parse(req.body.event);
            console.log(eventToSave)
            if (!eventToSave) {
                res.status(400).json({message: "Des informations sur l'evenement sont manquantes"});
                return;
            }

            if (!req.files || !req.files.img) {
                const eventCreated = await crudRepository.insert(eventToSave);
                res.status(201).json(eventCreated);
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
                        eventToSave.imgUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
                        const eventCreated = await crudRepository.insert(eventToSave);
                        res.status(201).json(eventCreated);
                    }
                });
            }
        } catch (e) {
            console.error(e)
            res.status(500).json({message: "Une erreur est survenu"})
        }
    }

    async function update(req: any, res: any) {
        try {
            const eventToSave = JSON.parse(req.body.event);
            if (!eventToSave) {
                res.status(400).json({message: "Des informations sur l'evenement sont manquantes"});
                return;
            }

            if (!req.files || !req.files.img) {
                const eventCreated = await crudRepository.update(eventToSave);
                res.status(201).json(eventCreated);
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
                        eventToSave.imgUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
                        const eventCreated = await crudRepository.update(eventToSave);
                        res.status(201).json(eventCreated);
                    }
                });
            }
        } catch (e) {
            console.error(e)
            res.status(500).json({message: "Une erreur est survenu"})
        }
    }

    return router;
}