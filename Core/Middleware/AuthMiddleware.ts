import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import UserModel from '../Models/UserModel'
import UserRepository from '../Repository/UserRepository'
import RoleCodes from "../../Commons/RoleCodes";

export default function (role: string) {
  return async (req: any, res: any, next: any) => {
    if(!req.headers.authorization){
        res.status(401).json({ message: "Vous n'étes pas autorisez à utiliser l'application" })
        return
    }
    const token = req.headers.authorization.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Vous n'étes pas autorisez à utiliser l'application" })
      return
    }

    let valid = false
    const AuthInfo: any = {}

    try {
      const result = jwt.verify(token, process.env.JWT_SECRET_KEY ?? 'oJtRnkPU9xk4yTc5dYgyWg1FQIEyy9yRjk7LFiuVell4PJ8YqwuFXaQ8UANc1ZdD')
      valid = true
    } catch (e) {
      valid = false
    }

    if (!valid) {
      res.status(401).json({ message: "Vous n'étes pas connecté" })
    } else {
      const decoded: any = jwtDecode(token)
      const userRepository: UserRepository = new UserRepository(UserModel.UserModel, [{ name: 'Roles' }])
      const result: any = await userRepository.getWithPassword({"_id": decoded.id})

      if (result === null || result.Roles === null || !result.Roles.map((r: any) => r.code).includes(role)) {
        res.status(403).json({ message: "Vous n'étes pas autorisé" })
      } else {
        result.password = undefined
        req.user = result
        req.user.IsAdmin = result.Roles.map(role => role.code).includes(RoleCodes.ADMIN)
        next()
      }
    }
  }
}
