const express = require('express');
const router = express.Router();
const Recipe = require('../../models/recipe.model');
const User = require('../../models/user.model');

//Get recipes by cuisine type
//Get recipes by ingredient
//Get recipe by category

//Post new recipe if doesn't exists in the db
router.post('/', (req, res, next) => {
  let { name, category, cuisine, instructions, ingredients } = req.body

  Recipe.findOne({name}, "name", (err, recipe) => {
    if (recipe !== null) {
      return res
          .status(202)
          .json({ message: "The recipe already exists" });
    }

    const newRecipe = new Recipe({
      name,
      category,
      cuisine,
      instructions,
      ingredients
    });

    newRecipe.save((err) => {
      if (err)              { return res.status(500).json(err); }
      if (newRecipe.errors) { return res.status(400).json(newRecipe); }

      return res.status(200).json(newRecipe);
    });
  })
});

//Get all recipes
router.get('/', (req, res, next) => {
  //Guardamos los parametros
  // let user = req.query.user
  // let photo = req.query.photo

  Recipe.find({}).then(
    recipes => res.status(200).json(recipes)
  )
  .catch(
    err => res.status(500).json(err)
  )
})

//Get recipe by ID
router.get('/:id', (req, res, next) => {
  Recipe.findById(req.params.id).then((recipe) => {
    if (!recipe) {
      return res.status(404).json({ message: 'Invalid recipe ID' })
    } else {
      return res.status(200).json(recipe)
    }
  })
  .catch(
    err => res.status(500).json(err)
  )
})


module.exports = router;
