"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = __importStar(require("mongoose"));
var mongoose_1 = require("mongoose");
/**
 * @typedef User
 */
var schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    followingIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: true
        }],
    Roles: [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: "Roles"
        }]
});
exports.default = { UserModel: mongoose.model('Users', schema) };
