import * as mongoose from 'mongoose'
import {Schema} from "mongoose";

/**
 * @typedef Options
 */
const postSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    upvote: {
        type: Number,
        required: true,
    },
    downvote: {
        type: Number,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    }
});

const eventModel = mongoose.model('Posts', postSchema);

export default {PostModel: eventModel};
