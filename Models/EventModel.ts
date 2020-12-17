import * as mongoose from 'mongoose'
import {Schema} from "mongoose";

/**
 * @typedef Options
 */
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    dateStart: {
        type: Date,
        required: true,
    },
    dateEnd: {
        type: Date,
        required: true,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Posts"
    }],
    imgUrl: {
        type: String,
        required: false
    },
    tags: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Tags"
    }],
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

const eventModel = mongoose.model('Events', eventSchema);

export default {EventModel: eventModel};
