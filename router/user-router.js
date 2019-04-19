
const express = require('express');
const cors = require('cors');
const controller = require('../controller/user-controller')();
const permittedOrigin = require('../common/permitted-origins');

module.exports = () => {

    const userRouter = express.Router();

    const options = {
        origin: permittedOrigin,
        credentials: true,
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

    userRouter.route('/users/currentUser')
        .get(controller.getCurrentIdentity);

    userRouter.route('/users/logout')
        .get(controller.logoutUser);

    userRouter.use('/users/:userId', controller.findUserById);

    userRouter.route('/users/:userId')
        .put(controller.updateUserDetails);

    userRouter.options("*", cors(options));

    return userRouter;

};