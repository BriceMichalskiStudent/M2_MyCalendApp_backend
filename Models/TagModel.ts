import * as mongoose from 'mongoose'

/**
 * @typedef Options
 */
const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
})

const model = mongoose.model('Tags', schema)

export default { TagModel: model }
