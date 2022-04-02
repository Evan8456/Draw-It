const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
    name: {type: String, required:true},
    username: {type: Array, required:true},
    path: {type: Object, required:false},
    public: {type: Boolean, required: true}
})

const model = mongoose.model('DrawModel', DrawingSchema);
module.exports = model;