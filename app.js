'use-strict';

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./router/user-router')();
const MongoStore = require('connect-mongo')(session);

const port = process.env.PORT || 3000;
const mongoURL = 'mongodb://localhost/UserLoginAPI';
const app = express();

mongoose.connect(mongoURL);

app.get('/', (request, response) => {
    response.send('Welcome to the User Login Nodemon API');
});

app.use(session({
    secret: 'iLoveElephants',
    cookie: {
        maxAge: 1 * 360000,
        secure: false
    }, 
    store: new MongoStore({
        url: mongoURL
    }),
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', userRouter)

app.server = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});