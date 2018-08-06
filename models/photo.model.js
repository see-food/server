const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PhotoSchema = Schema({
  path:{
    type: String,
    required: true
  },
  filename:{
    type: String,
    required: true
  },
  recipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  clarifaiInfo:[{
    name: String,
    value: {
      type: Number,
      minValue: 0.98
    }
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
