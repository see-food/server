const express = require('express');
const router = express.Router();
const Recipe = require('../../models/recipe.model');
const User = require('../../models/user.model');
const Photo = require('../../models/photo.model')
const upload = require('../../cloudinary/cloudinary');
const Clarifai = require('clarifai');
const clarifaiApp = new Clarifai.App({
 apiKey: process.env.CLARIFAI_KEY
});

router.post('/', upload.single('photo'), (req, res, next) => {
  console.log('asdasd')
  console.log(req.file);
  const newPhoto = new Photo({
    filename: req.file.originalname,
    path: req.file.url
  });

  newPhoto.save()
    .then(photo=>{
      clarifaiApp.models.predict(Clarifai.FOOD_MODEL, photo.path)
      .then( resp => {
        console.log(resp);
        res.status(200).json(resp.outputs[0].data)
      })
    })
    .catch(err=> {
      console.log(err);
      res.status(500).json(err)
    })
})

module.exports = router;
