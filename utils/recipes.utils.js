const Recipe = require('../models/recipe.model')

const saveRecipes = (recipesParams) => {
  return Promise.all(recipesParams.map(recipe => {
    return new Promise((resolve, reject) => {
      let { name, time, servings, calories, instructions, images, ingredients } = recipe
      Recipe.findOne({name}, (err, recipe) => {

        if (recipe !== null) {
          resolve(recipe)
        }

        const newRecipe = new Recipe({
          name,
          time,
          servings,
          calories,
          instructions,
          images,
          ingredients
        })

        newRecipe.save((err) => {
          if (err) return res.status(500).json(err)
          if (newRecipe.errors) return res.status(400).json(newRecipe)
          resolve(newRecipe)
        })
      })
    })
  }))
  .then(recipes => recipes)
}


module.exports = {
  saveRecipes
}
