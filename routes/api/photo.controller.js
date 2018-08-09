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
      console.log(concepts.outputs[0].data.concepts)
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
      newPhoto.save()
        .then(photo => {
          //Make search term joinign clarifai info
          const searchTerm = photoUtils.extractTerms(photo).join(',')

          if (!searchTerm) return res.status(200).json({
            message: 'No items found on this photo',
            photo
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
          return res.status(200).json({
            message: 'Photo uploaded correctly, searching recipes in the background',
            photo
          })
        })
        .catch(err => {
          console.log(err)
          return res.status(500).json(err)
        })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err)
    })
})


router.get('/delete/:id', (req, res, next) => {
  if (!req.user) return res.status(403).json({message: 'User is not logged in'})

  Photo.findById(req.params.id)
  .then(photo => {
    //If photo does not exist -> 404
    if (!photo) return res.status(404).json({message: 'Photo not found'})
    //If logged user is not the propietary of the photo -> 403, else -> delete photo
    if (req.user._id.equals(photo.user)) {
      Photo.findByIdAndRemove(req.params.id).then(() => {
        return res.status(200).json({message: 'The photo have been deleted'})
      })
    } else {
      return res.status(403).json({message: 'The photo does not belong to the user'})
    }
  })
  .catch(err => {
    return res.status(500).json(err)
  })
})

//Extract photo info
router.get('/:id', (req, res, next) => {
  if (!req.user) return res.status(403).json({message: 'User is not logged in'})
  //There showld be a call to user recipes!!!!
  Photo.findById(req.params.id).populate('recipes')
  .then(photo => {
    //If photo does not exist -> 404
    if (!photo) return res.status(404).json({message: 'Photo not found'})
    //If logged user is not the propietary of the photo -> 403, else -> photo
    if (req.user._id.equals(photo.user)) {
      return res.status(200).json(photo)
    } else {
      return res.status(403).json({message: 'The photo does not belong to the user'})
    }
  })
  .catch(err => {
    return res.status(500).json(err)
  })
})

module.exports = router;
