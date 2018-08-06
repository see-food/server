const express = require('express');
const router = express.Router();
const Recipe = require('../../models/recipe.model');
const User = require('../../models/user.model');
const Photo = require('../../models/photo.model')
const uploadCloud = require('../../config/cloudinary');
const allrecipesUtils = require('../../utils/allrecipes.utils')
const photoUtils = require('../../utils/photo.utils')
const recipesUtils = require('../../utils/recipes.utils')
const Clarifai = require('clarifai');
const clarifaiApp = new Clarifai.App({
 apiKey: process.env.CLARIFAI_KEY
});

router.post('/', uploadCloud.single('file'), (req, res, next) => {

  clarifaiApp.models.predict(Clarifai.FOOD_MODEL, req.file.url)
    .then(concepts => {
      console.log(concepts.outputs[0].data);
      const filteredConcepts = concepts.outputs[0].data.concepts.filter(el => el.value >= 0.98)
      filteredConcepts.map(el => {
        delete el.id
        delete el.app_id
        return el;
      });
      const newPhoto = new Photo({
        filename: req.file.originalname,
        path: req.file.url,
        user: req.user._id,
        clarifaiInfo: filteredConcepts
      });
      console.log(newPhoto);
      newPhoto.save()
        .then(photo => {
          //Make search term joinign clarifai info
          const searchTerm = photoUtils.extractTerms(photo).join(',')

          if (!searchTerm) res.status(404).json({
            message: 'No items found on this photo'
          })

          const url = `${process.env.ALLRECIPES_ENDPOINT}${searchTerm}`

          //Scrape search page
          allrecipesUtils.scrapeSearch(url)
          .then( urls => {
            //Scrape individual recipes finded
            allrecipesUtils.scrapeRecipes(urls)
            .then( recipes => {
              //Save recipes in database
              recipesUtils.saveRecipes(recipes)
              .then(recipes => {
                //Update photo with recipes ids
                photoUtils.addRecipesToPhoto(photo._id, recipes)
              })
            })
          })
          .catch( err => console.log(err) )

          //Inmediatelly send 200 after uploading photo
          res.status(200).json({
            message: 'Photo uploaded correctly, searching recipes in the background',
            photo
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json(err)
        })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err)
    })
})

//Extract user photos
router.get('/', (req, res, next) => {
  Photo.find({'user': req.user._id})
  .then(photos => {
    if (!photos) res.status(404).json({message: 'User has no photos yet'})

    res.status(200).json(photos)
  })
})

//Extract photo info
router.get('/:id', (req, res, next) => {
  //There showld be a call to user recipes!!!!
})

module.exports = router;
