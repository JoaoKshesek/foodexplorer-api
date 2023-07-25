const { Router } = require('express');

const UsersController = require('../controllers/UsersController');
const usersController = new UsersController();

const ensureAuthenticated = require("../middleware/ensureAuthenticated")
const usersRoutes = Router();

usersRoutes.post('/', usersController.create)
usersRoutes.put('/', ensureAuthenticated, usersController.update)

module.exports = usersRoutes;