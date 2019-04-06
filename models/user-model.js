
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    username: { type: String },
    password: { type: String }
});

module.exports = mongoose.model('User', userModel);