import * as  mongoose from 'mongoose'
import RoleCodes from "../Commons/RoleCodes";

/**
 * @typedef Options
 */
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    values: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        required: false,
    }
});

let model = mongoose.model('Tests', schema);

const ensureCreated = async () => {
    for (let i = 1; i < 101; i++) {
        if ((await model.findOne({code: i})) === null) {
            await model.create({
                code: i,
                title: "Test " + i,
                values: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In congue velit non leo vehicula, ut tincidunt nibh tempor. Pellentesque sed accumsan mauris. Sed ornare tristique semper."
            });
        }
    }
};
export default {TestModel: model, EnsureEntities: ensureCreated};
