const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    name: String,
    phone: String,
}, { versionKey: false });


module.exports = model('User', userSchema);