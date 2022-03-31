const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    picture: {type: String, required:true},
    shared: [{type: String, required:true}],
    name: {type: String, required:true}
})

const model = mongoose.model('RoomModel', RoomSchema);
module.exports = model;
