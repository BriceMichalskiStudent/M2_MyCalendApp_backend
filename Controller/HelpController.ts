import * as express from "express";
import axios from "axios";

export default function () {
    const router = express.Router();

    router.get('/address', searchAddress)

    async function searchAddress(req: any, res: any) {
        try {
            const response = await axios.get('https://api-adresse.data.gouv.fr/search/', {
                params: {
                    q: req.query.q
                }
            });
            res.status(200).json(response.data)
        } catch (e) {
            console.error(e)
            res.status(500).send("Une erreur est survenu")
        }
    }

    return router;
}