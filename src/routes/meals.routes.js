const { Router } = require('express');

const MealsController = require('../controllers/MealsController');
const mealsController = new MealsController();

const ensureAuthenticated = require("../middleware/ensureAuthenticated")
const mealsRoutes = Router();

mealsRoutes.use(ensureAuthenticated)
mealsRoutes.get('/', mealsController.index);
mealsRoutes.get('/:id', mealsController.show);

module.exports = mealsRoutes;