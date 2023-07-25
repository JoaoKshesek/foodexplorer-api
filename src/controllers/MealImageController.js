const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class MealImageController {
  async update(request, response) {
    const { id } = request.params;
    const mealFilename = request.file.filename;
    const diskStorage = new DiskStorage();
    const meal = await knex("meals").where({ id }).first();

    if (meal.image) {
      await diskStorage.deleteFile(meal.image);
    }
    const filename = await diskStorage.saveFile(mealFilename);
    meal.image = filename;
    await knex("meals").update(meal).where({ id });
    return response.json(meal);
  }
}
module.exports = MealImageController;
