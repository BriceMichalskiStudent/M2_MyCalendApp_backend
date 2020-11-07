import * as  mongoose from 'mongoose';
import {Schema} from "mongoose";
import RoleCodes from "../../Commons/RoleCodes";

/**
 * @typedef Role
 */
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
});

const model = mongoose.model('Roles', schema);

const ensureRoleCreated = async () => {
    if ((await model.findOne({code: RoleCodes.ADMIN})) === null) {
        await model.create({code: RoleCodes.ADMIN, name: "Administrateur"});
    }
    if ((await model.findOne({code: RoleCodes.USER})) === null) {
        await model.create({code: RoleCodes.USER, name: "Utilisateur"});
    }
};

export default {RoleModel: model, EnsureEntities: ensureRoleCreated};
