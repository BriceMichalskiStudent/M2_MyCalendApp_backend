import _crudRepository from '../Repository/CrudRepository'
import _listController from './ListController'

export default function (crudRepository: _crudRepository) {
  const router = _listController(crudRepository);
  router.put('/', update)
  router.post('/', create)
  router.delete('/:id', del)

  async function del (req: any, res: any) {
    await crudRepository.del(req.params.id)
    res.send()
  }

  async function update (req: any, res: any) {
    const data = await crudRepository.update(req.body)
    res.json(data)
  }

  async function create (req: any, res: any) {
    const data = await crudRepository.insert(req.body)
    res.json(data)
  }

  return router
}
