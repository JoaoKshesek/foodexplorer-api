const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class MealsAdminController {
  async create(request, response) {
    const { title, description, category, price, ingredients } = request.body;
    const checkMealAlreadyExistInDatabase = await knex("meals")
      .where({ title })
      .first();

    if (checkMealAlreadyExistInDatabase) {
      throw new AppError("Este prato já existe em nossa database");
    }
    const mealFilename = request.file.filename;
    const diskStorage = new DiskStorage();
    const filename = await diskStorage.saveFile(mealFilename);
    const meal_id = await knex("meals").insert({
      image: filename,
      title,
      description,
      category,
      price,
    });
    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        name: ingredient,
        meal_id,
      };
    });
    await knex("ingredients").insert(ingredientsInsert);
    return response.status(201).json();
  }

  async delete(request, response) {
    const { id } = request.params;
    await knex("meals").where({ id }).delete();
    return response.status(204).json();
  }

  async update(request, response) {
    const { title, description, category, image, price, ingredients } =
      request.body;
    const { id } = request.params;
    const meal = await knex("meals").where({ id }).first();
    if (!meal) {
      throw new AppError("O prato que você está tentando atualizar não existe");
    }
    meal.title = title ?? meal.title;
    meal.description = description ?? meal.description;
    meal.category = category ?? meal.category;
    meal.image = image ?? meal.image;
    meal.price = price ?? meal.price;
    await knex("meals").where({ id }).update(meal);
    await knex("meals").where({ id }).update("updated_at", knex.fn.now());
    const hasOnlyOneIngredient = typeof ingredients === "string";
    let ingredientsInsert;
    if (hasOnlyOneIngredient) {
      ingredientsInsert = {
        meal_id: meal.id,
        name: ingredients,
      };
    } else if (ingredients.length > 1) {
      ingredientsInsert = ingredients.map((ingredient) => {
        return {
          meal_id: meal.id,
          name: ingredient,
        };
      });
      await knex("ingredients").where({ meal_id: id }).delete();
      await knex("ingredients")
        .where({ meal_id: id })
        .insert(ingredientsInsert);
    }
    return response.status(202).json("Prato atualizado com sucesso");
  }
}

module.exports = MealsAdminController;
