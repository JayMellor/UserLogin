
"use-strict";

const User = require('../models/user-model');
const httpStatus = require('http-status');

module.exports = () => {

    const loginUser = (request, response) => {

        const reqUserName = request.body.username;
        const reqPassword = request.body.password;

        if (!reqUserName) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input a username.');
        }
        if (!reqPassword) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input a password.');
        }

        User.findOne({
            username: reqUserName,
            password: reqPassword
        }, (error, user) => {
            if (error) {
                return response.status(httpStatus.FORBIDDEN).send(error);
            }
            if (user) {
                // Set session user
                request.session.user = user;

                return response.status(httpStatus.OK)
                    .send(`{ 
                    "success": "true",
                    "user": ${JSON.stringify(user)}
                }`);
            }
            else {
                return response.status(httpStatus.FORBIDDEN).send('Invalid username/password combination');
            }
        });
    };

    const logoutUser = (request, response) => {

        if (!request.session.user) {
            return response.status(httpStatus.BAD_REQUEST).send('you are not logged in');
        }

        request.session.destroy((error) => {

            if (error) {
                return response.send(error);
            }
            
            return response.status(httpStatus.OK)
            .send(`
            {
                "success": true
            }
            `);
        });
    }

    const changePassword = (request, response) => {
        
        const reqUserName = request.body.username;
        const oldPassword = request.body.password;
        const newPassword = request.body.newPassword;

        if (!reqUserName) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input a username.');
        }
        if (!oldPassword) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input your current password');
        }
        if (!newPassword) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input your new password');
        }
        if (oldPassword === newPassword) {
            return response.status(httpStatus.BAD_REQUEST).send('New password must be different to the current one');
        }

        User.findOne({
            username: reqUserName,
            password: oldPassword
        }, (error, user) => {
            if (error) {
                return response.send(error);
            }
            if (user) {
                // Update password
                user.password = newPassword;

                return user.save((error) => {
                    if (error) {
                        return response.send(error);
                    }
                    return response.json(user);
                });
            }
            else {
                return response.status(httpStatus.BAD_REQUEST).send('Invalid username/password combination');
            }
        });

    };

    const getUsers = (request, response) => {
        User.find((error, users) => {
            if (error) {
                return response.send(error);
            }
            return response.json(users);
        })
    };

    const addUser = (request, response) => {

        const reqUserName = request.body.username;
        const reqPassword = request.body.password;
        const reqFirstName = request.body.firstName;
        const reqSurname = request.body.surname;
        const reqIsAdmin = request.body.isAdmin;

        // check request has username and password
        if (!reqUserName) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input a username.');
        }
        if (!reqPassword) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input a password');
        }
        if (!reqFirstName) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input a first name');
        }
        if (!reqSurname) {
            return response.status(httpStatus.BAD_REQUEST).send('Please input a surname');
        }

        // check username does not already exist
        const byUserName = {
            username: reqUserName
        };
        User.countDocuments(byUserName, (error, count) => {
            if (error) {
                return response.send(error);
            }
            if (count > 0) {
                return response.status(httpStatus.BAD_REQUEST).send(`User ${reqUserName} already exists.`);
            }
            else {
                // add username / password

                const user = new User({
                    username: reqUserName,
                    password: reqPassword,
                    firstName: reqFirstName,
                    surname: reqSurname,
                    isAdmin: reqIsAdmin
                });

                user.save();
                response.status(httpStatus.CREATED);
                return response.json(user);
            }
        });

    };

    const findUserById = (request, response, next) => {

        User.findById(request.params.userId, (error, user) => {
            if (error) {
                return response.send(error);
            }
            if (user) {
                request.user = user;
                return next();
            }
            else {
                return response.sendStatus(httpStatus.NOT_FOUND);
            }
        });

    };

    /**
     * Updates the firstname, surname and isAdmin fields as specified
     * 
     * @param {Object} request request object
     * @param {Object} response response object
     */
    const updateUserDetails = (request, response) => {

        const { user } = request;

        user.firstName = request.body.firstName;
        user.surname = request.body.surname;
        user.isAdmin = request.body.isAdmin;

        return request.user.save((error) => {
            if (error) {
                return response.send(error);
            }
            return response.json(user);
        });

    };

    const getCurrentIdentity = (request, response) => {

        if (request.session.user) {
            return response.status(httpStatus.OK).send(request.session.user);
        }

        return response.send(null);

    };

    return {
        loginUser, logoutUser, changePassword, getUsers, addUser, findUserById, updateUserDetails,
        getCurrentIdentity
    };

};