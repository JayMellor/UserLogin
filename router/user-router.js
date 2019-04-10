
const express = require('express');
const cors = require('cors');
const controller = require('../controller/user-controller')();
const permittedOrigin = require('../common/permitted-origins');

module.exports = () => {

    const userRouter = express.Router();

    const options = {
        allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
        credentials: true,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        origin: permittedOrigin,
        preflightContinue: false
    };

    //use cors middleware
    userRouter.use(cors(options));

    userRouter.route('/users')
        .post(controller.loginUser)
        .get(controller.getUsers)
        .put(controller.changePassword);

    userRouter.route('/users/new')
        .post(controller.addUser);

    userRouter.options("*", cors(options));

    return userRouter;

};