const Photo = require('../models/photo.model')

//Function that extracts the search terms given a photo
const extractTerms = (photo) => {
  let terms = []

  photo.clarifaiInfo.forEach(e => {
    terms.push(e.name)
  })

  return terms
}

//Function that adds recipes ids to a photo
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
