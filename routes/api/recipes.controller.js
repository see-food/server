const express = require('express');
const router = express.Router();
const Recipe = require('../../models/recipe.model');
const User = require('../../models/user.model');
const recipes = require('../../utils/recipes.utils')

//Post new recipe if doesn't exists in the db
router.post('/', (req, res, next) => {
  let { name, time, servings, calories, instructions, images, ingredients } = req.body

  const newRecipe = new Recipe({
    name,
    time,
    servings,
    calories,
    instructions,
    images,
    ingredients
  })

  Recipe.findOne({name}, (err, recipe) => {
    //Recipe already exists
    if (recipe !== null) {
      return res.status(202).json(recipe);
    }

    const newRecipe = new Recipe({
      name,
      time,
      servings,
      calories,
      instructions,
      images,
      ingredients
    });

    newRecipe.save((err) => {
      if (err) return res.status(500).json(err)
      if (newRecipe.errors) return res.status(400).json(newRecipe)

      return res.status(200).json(newRecipe);
    });
  })
});

//Get all recipes
router.get('/', (req, res, next) => {
  Recipe.find({}).then(
    recipes => res.status(200).json(recipes)
  )
  .catch(
    err => res.status(500).json(err)
  )
})


//Fav/unfav a recipe
router.get('/fav/:id', (req, res, next) => {
  Recipe.findById(req.params.id)
  .then(recipe => {
    if (!recipe) res.status(419).json({message: 'Recipe does not exist in database'})

    User.findById(req.user._id)
    .then(user => {
      let recipes = user.recipes
      let filteredRecipes = []
      let update = {}

      //If recipe already exists in user recipes array, delete it, otherwise, include it
      if (recipes.some(e => e.equals(req.params.id))) {
        filteredRecipes = recipes.filter(e => {
          e != req.params.id
        })
      } else {
        recipes.push(req.params.id)
        filteredRecipes = recipes
      }

      update = { recipes: filteredRecipes }

      User.findByIdAndUpdate(req.user._id, update, {new: true})
      .then(user => {
        res.status(200).json({message: `Recipe ${req.params.id} toggled from user ${req.user._id}`})
      })
    })
  })
  .catch(err => res.status(500).json(err))
})


router.get('/isfav/:id', (req, res, next) => {
  User.findById(req.user._id, 'recipes')
  .then(user => {
    if (user.recipes.filter(e => e == req.params.id).length > 0) {
      res.status(200).json({message: 'true'})
    } else {
      res.status(200).json({message: 'false'})
    }
  })
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
