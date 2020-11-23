import CrudRepository from '../Repository/CrudRepository'
import ListController from '../Controllers/ListController'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default function (crudRepository: CrudRepository) {
  const router = ListController(crudRepository)
  router.post('/', create)
  router.delete('/:id', del)

  async function del (req: any, res: any) {
    const data: any = await crudRepository.get(req.params.id)
    data.token = null
    data.save().exec()
    res.json(data)
  }

  async function create(req: any, res: any) {
      let user: any = await crudRepository.getCustom({"mail": req.body.mail});

      if (!user) {
          res.status(400).json("Ce compte est introuvable.");
          return;
      }

      let valid: boolean;
      valid = await bcrypt.compare(req.body.password, user.password);

      if (!valid) {
          res.status(401).json("Mot de passe incorrect.");
          return;
      } else {
          let data: any = {};
          data.user = user;
          data.token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY ?? "oJtRnkPU9xk4yTc5dYgyWg1FQIEyy9yRjk7LFiuVell4PJ8YqwuFXaQ8UANc1ZdD", {expiresIn: 43200});

          res.json(data);
      }
  }

  return router
}
