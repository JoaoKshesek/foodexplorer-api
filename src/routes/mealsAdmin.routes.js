const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload')

const MealsAdminController = require('../controllers/MealsAdminController');
const MealImageController = require('../controllers/MealImageController')

const mealsAdminRoutes = Router();
const upload = multer(uploadConfig.MULTER)

const mealsAdminController = new MealsAdminController();
const mealImageController = new MealImageController()

mealsAdminRoutes.post('/', upload.single("image"), mealsAdminController.create);
mealsAdminRoutes.delete('/:id', mealsAdminController.delete)
mealsAdminRoutes.put('/:id', mealsAdminController.update)
mealsAdminRoutes.patch('/mealImage/:id', upload.single("image"), mealImageController.update)

module.exports = mealsAdminRoutes;