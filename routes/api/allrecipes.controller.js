const express = require('express')
const router = express.Router();
const Recipe = require('../../models/recipe.model');//?
const allrecipes = require('../../utils/allrecipes.utils')



//Search recipes
router.get('/:s', (req, res, next) => {
  const search = req.params.s
  const url = `${process.env.ALLRECIPES_ENDPOINT}${search}`

  allrecipes.scrapeSearch(url)
  .then( urls => {
    allrecipes.scrapeRecipes(urls)
    .then(recipes => {
      res.send(recipes)
    })
  })
  .catch( err => console.log(err) )
})


module.exports = router;
