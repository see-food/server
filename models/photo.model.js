const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PhotoSchema = Schema({
  path:{
    type: String,
    required: true
  },
  filename:{
    type: String,
    require: true
  },
  recipe: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  clarifaiInfo:[{
    tag: String,
    weight: { 
      type: Number,
      minValue: 0.98
    }
  }]
}, {
  timestamps:{ createdAt: 'createdAT', updatedAt:'updatedAt'}
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
