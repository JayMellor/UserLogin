
const User = require('../models/user-model');

module.exports = () => {

    const verifyRequest = (request, options) => {

        let requestIsValid = true;

        Object.entries(request.body).forEach((item) => {
            const key = item[0];
            const value = item[1];

            const matchingKey = options.find((option) => option === key);

            if (!matchingKey) {
                requestIsValid = false;
            }
            if (!value) {
                requestIsValid = false;
            }

        });

        return requestIsValid;

    }

    const loginUser = (request, response) => {

        const options = [
            'username',
            'password'
        ];

        if (!verifyRequest(request, options)) {
            return response.status(400).send('error');
        }

        const reqUserName = request.body.username;
        const reqPassword = request.body.password;

        User.findOne({
            username: reqUserName,
            password: reqPassword
        }, (error, user) => {
            if (error) {
                return response.send(error);
            }
            if (user) {
                return response.send(`Successfully logged in. Welcome ${reqUserName}!`);
            }
            else {
                return response.send('Invalid username/password combination');
            }
        });
    };

    const changePassword = (request, response) => {
        const reqUserName = request.body.username;
        const oldPassword = request.body.password;
        const newPassword = request.body.newPassword;

        if (!reqUserName) {
            return response.status(400).send('Please input a username.');
        }
        if (!oldPassword) {
            return response.status(400).send('Please input your current password');
        }
        if (!newPassword) {
            return response.status(400).send('Please input your new password');
        }
        if (oldPassword === newPassword) {
            return response.status(400).send('New password must be different to the current one');
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
                return response.send('Invalid username/password combination');
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

        // check request has username and password
        if (!reqUserName) {
            return response.status(400).send('Please input a username.');
        }
        if (!reqPassword) {
            return response.status(400).send('Please input a password');
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
                return response.send(`User ${reqUserName} already exists.`);
            }
            else {
                // add username / password

                const user = new User({
                    username: reqUserName,
                    password: reqPassword
                });

                user.save();
                response.status(201);
                return response.json(user);
            }
        });

    };

    return { loginUser, changePassword, getUsers, addUser };

};