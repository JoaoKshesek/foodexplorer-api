const knex = require("../database/knex");

class MealsController {
  async show(request, response) {
    const { id } = request.params;
    const meal = await knex("meals").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ meal_id: id })
      .orderBy("name");
    return response.status(200).json({
      ...meal,
      ingredients,
    });
  }

  async index(request, response) {
    const { title, ingredients } = request.query;
    let meals;
    if (ingredients) {
      const filteredIngredients = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim());
        meals = await knex("ingredients")
        .select([
          "meals.id",
          "meals.title",
          "meals.price",
          "meals.category",
          "meals.image",
          "meals.price",
        ])
        .whereLike("meals.title", `%${title}%`)
        .whereIn("name", filteredIngredients)
        .innerJoin("meals", "meals.id", "ingredients.meal_id")
        .orderBy("meals.title");
    } else {
      meals = await knex("meals").whereLike("title", `%${title}%`);
    }
    const mealsIngredients = await knex("ingredients");
    const mealsWithIngredients = meals.map((meal) => {
      const mealIngredient = mealsIngredients.filter(
        (ingredient) => ingredient.meal_id === meal.id
      );
      return {
        ...meal,
        ingredients: mealIngredient,
      };
    });
    return response.status(200).json(mealsWithIngredients);
  }
}

module.exports = MealsController;
