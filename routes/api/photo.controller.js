const express = require('express');
const router = express.Router();
const Recipe = require('../../models/recipe.model');
const User = require('../../models/user.model');
const Photo = require('../../models/photo.model')
const uploadCloud = require('../../config/cloudinary');
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
        .then(photo => res.status(200).json({
          message: 'photo uploaded correctly',
          photo
        }))
        .catch(err => res.status(500).json(err))
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err)})
})

module.exports = router;
