const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const recipeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  time: {
    type: String
  },
  servings: {
    type: Number
  },
  calories: {
    type: Number
  },
  instructions: {
    type: [String],
    required: [true, 'Instructions are required']
  },
  images: {
    type: [String]
  },
  ingredients: {
    type: [String],
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


const recipe = mongoose.model('Recipe', recipeSchema);
module.exports = recipe;
