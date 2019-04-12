# UserLogin

A simple user authentication API for interfacing with a MongoDB database.

Uses the following schema:

````JavaScript
const userModel = new Schema({
    username: { type: String },
    password: { type: String }
});
