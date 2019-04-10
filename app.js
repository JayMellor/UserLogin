'use-strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./router/user-router')();

const port = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost/UserLoginAPI');

app.get('/', (request, response) => {
    response.send('Welcome to the User Login Nodemon API');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', userRouter)

app.server = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});