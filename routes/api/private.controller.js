const express = require('express')
const router = express.Router()
const Photo = require('../../models/photo.model')
const User = require('../../models/user.model')
const Recipe = require('../../models/recipe.model')


//Extract user photos
router.get('/pics', (req, res, next) => {
  if (!req.user) res.status(403).json({message: 'User is not logged in'})
  Photo.find({'user': req.user._id})
  .then(photos => {
    if (!photos) res.status(404).json({message: 'User has no photos yet'})
    res.status(200).json(photos)
  })
  .catch(err => {
    res.status(500).json(err)
  })
})

//List user faved recipes
router.get('/recipes', (req, res, next) => {
  if (!req.user) res.status(403).json({message: 'User is not logged in'})
  User.findById(req.user._id)
  .then(user => {
    if (!user) res.status(403).json({ message: 'User does not exist'})

    let query = {_id: []}
    user.recipes.forEach(e => query._id.push(e))
    console.log(query)
    //Search
    Recipe.find(query)
    .then(recipes => {
      if (!recipes) res.status(404).json({ message: 'User does not have starred recipes yet'})
      res.status(200).json(recipes)
    })
  })
  .catch(err => {
    res.status(500).json(err)
  })
})


module.exports = router
