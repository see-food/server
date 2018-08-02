const express = require('express');
const axios = require('axios')
const router = express.Router();
const Recipe = require('../../models/recipe.model');//?



//Search recipes by name
router.get('/:s', (req, res, next) => {
  axios.get(`${process.env.MEALDB_ENDPOINT}search.php?s=${req.params.s}`)
    .then(function(response){
      console.log(response.data); // ex.: { user: 'Your User'}
      console.log(response.status); // ex.: 200

      return res.satatus(200).json(response)
    })


})


module.exports = router;
