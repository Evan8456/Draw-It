const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomName: {type: String, required:true},
    userLimit: {type: Number, required:true, default:5},
    salt: {type: String, required:true},
    dateCreated: {type: Date, default:Date.now}
})

const model = mongoose.model('RoomModel', RoomSchema);
module.exports = model;
