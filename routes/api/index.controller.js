const express = require('express');
const router  = express.Router();

const authRoutes = require('./authentication.controller');
const recipesRoutes = require('./recipes.controller')
const allrecipesRoutes = require('./allrecipes.controller.js');
const photoRoutes = require('./photo.controller.js');

router.use('/', authRoutes);
router.use('/recipes', recipesRoutes)
router.use('/allrecipes', allrecipesRoutes)
router.use('/pics', photoRoutes)

module.exports = router;
