const Photo = require('../models/photo.model')

const extractTerms = (photo) => {
  let terms = []

  photo.clarifaiInfo.forEach(e => {
    terms.push(e.name)
  })

  return terms
}


const addRecipesToPhoto = (photoId, recipes) => {
  let update = {
    recipes: []
  }
  
  recipes.forEach(e => {
    update.recipes.push(e._id)
  })

  Photo.findByIdAndUpdate(photoId, update)
  .then(photo => {
    console.log(`Recipes added to photo ${photoId}`)
  })
}


module.exports = {
  extractTerms,
  addRecipesToPhoto
}
