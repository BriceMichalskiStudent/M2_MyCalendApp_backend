import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";
import UserModel from "../Models/UserModel"
import UserRepository from "../Repository/UserRepository";

export default function (role: string) {
    return async (req: any, res: any, next: any) => {
        let token = req.headers['authorization'];

        console.error("[AuthMiddleware] token : ", token);
        if (!token) {
            res.status(401).json({message: "Vous n'étes pas autorisez à utiliser l'application"});
            return;
        }

        console.log("token : ", token);

        let valid: boolean = false;
        let AuthInfo: any = {};

        try {
            let result = jwt.verify(token, process.env.JWT_SECRET_KEY ?? "oJtRnkPU9xk4yTc5dYgyWg1FQIEyy9yRjk7LFiuVell4PJ8YqwuFXaQ8UANc1ZdD");
            valid = true;
            console.log("[AuthMiddleware] result : ", result);
        } catch (e) {
            valid = false;
        }

        if (!valid) {
            res.status(401).json({message: "Vous n'étes pas autorisez à utiliser l'application"});
        } else {
            let decoded: any = jwt_decode(token);
            const userRepository: UserRepository = new UserRepository(UserModel.UserModel, [{name: "Roles"}]);
            const result: any = await userRepository.get(decoded.id);

            if (result === null || result.Roles === null || !result.Roles.map((r: any) => r.code).includes(role)) {
                res.status(401).json({message: "Vous n'étes pas autorisez"});
            } else {
                next();
            }
        }
    };
}
