const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine is required']
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required']
  },
  image: String,
  video: String,
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: String
    }
  ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


const recipe = mongoose.model('Recipe', recipeSchema);
module.exports = recipe;
