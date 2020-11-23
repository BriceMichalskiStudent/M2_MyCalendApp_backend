import * as express from 'express'
import ListRepository from '../Repository/ListRepository'

export default function (listRepository: ListRepository) {
  const router = express.Router()
  router.get('/', list)
  router.get('/:id', get)

  async function list (req: any, res: any) {
    const data = await listRepository.list()
    res.json(data)
  }

  async function get (req: any, res: any) {
    const data = await listRepository.get(req.params.id)
    res.json(data)
  }

  return router
}
