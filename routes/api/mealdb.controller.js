const express = require('express');
const axios = require('axios')
const router = express.Router();
const Recipe = require('../../models/recipe.model');//?



//Search recipes by name
router.get('/:s', (req, res, next) => {
  axios.get(`${process.env.MEALDB_ENDPOINT}search.php?s=${req.params.s}`)
    .then(response => {
      res.send(response.data)
    })
})


//Search recipes by main ingredient
router.get('/ingredient/:s', (req, res, next) => {
  axios.get(`${process.env.MEALDB_ENDPOINT}filter.php?i=${req.params.s}`)
    .then(response => {
      res.send(response.data)
    })
})

module.exports = router;
