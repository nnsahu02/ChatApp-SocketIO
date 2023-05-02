const express = require('express');
const route = express.Router()

const { signUp, login, allUsers } = require('../controller/userController')

route.post('/user/signup', signUp);

route.post('/user/login', login);

route.get('/user/allusers', allUsers)

module.exports = route