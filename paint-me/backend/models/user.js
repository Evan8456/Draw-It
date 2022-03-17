const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required:true},
    hashPassword: {type: String, required:true},
    salt: {type: String, required:true},
    dateCreated: {type: Date, default:Date.now}
})

const model = mongoose.model('UserModel', UserSchema);
module.exports = model;
