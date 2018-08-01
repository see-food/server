const express = require('express');
const router = express.Router();
const Recipe = require('../../models/recipe.model');
const User = require('../../models/user.model');
const Clarifai = require('clarifai');
const clarifaiApp = new Clarifai.App({
 apiKey: process.env.CLARIFAI_KEY
});

const foodModel = clarifaiApp.models.get('food-items-v1.0')


router.get('/', (req, res, next) => {
  
  clarifaiApp.models.predict(Clarifai.FOOD_MODEL, "http://as01.epimg.net/epik/imagenes/2017/10/31/portada/1509469785_213048_1509471547_noticia_normal.jpg")
  .then( resp => {
    console.log(resp);
    res.status(200).json(resp.outputs[0].data)
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json(err)
  })
})

module.exports = router;
