const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
    filename: {type: String, required:true},
    path: {type: String, required:true},
    tags: [{body: String}],
    author: {type: String, required:true},
    title: {type: String, required:true},
    datePosted: {type: Date, default:Date.now}
})

const model = mongoose.model('PictureModel', PictureSchema);
module.exports = model;