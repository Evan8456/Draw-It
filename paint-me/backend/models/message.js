const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    _roomid: {type: String, required:true},
    username: {type: String, required:true},
    content: {type: String, required:true},
    datePosted: {type: Date, default:Date.now}
})

const model = mongoose.model('MessageModel', MessageSchema);
module.exports = model;
