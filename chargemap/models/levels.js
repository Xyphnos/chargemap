
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const levelsSchema = new Schema({
    Comments: String,
    IsFastChargeCapable: Boolean,
    Title: String
});

module.exports = mongoose.model('Levels', levelsSchema);