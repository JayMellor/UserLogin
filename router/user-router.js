
const express = require('express');
const controller = require('../controller/user-controller')();

module.exports = () => {

    const userRouter = express.Router();

    userRouter.route('/users')
        .post(controller.loginUser)
        .get(controller.getUsers)
        .put(controller.changePassword);

    userRouter.use('/users/new', (request, response, next) => {
        
    })    

    userRouter.route('/users/new')
        .post(controller.addUser);

    return userRouter;

};