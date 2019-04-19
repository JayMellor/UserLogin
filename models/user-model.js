
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    username: { type: String },
    password: { type: String },
    firstName: { type: String },
    surname: { type: String },
    isAdmin: { type: Boolean }
});

module.exports = mongoose.model('User', userModel);