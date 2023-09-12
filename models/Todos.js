const { Schema, model } = require('mongoose')

const todoSchema = new Schema({
    title: String,
    complete: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date,
        default: () => new Date(+new Date() + 1*24*60*60*1000)
    },
    executor: { type : Schema.Types.ObjectId, ref: 'User'}

}, { versionKey: false });

module.exports = model('Todo', todoSchema);