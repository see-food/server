const express = require('express');
const router  = express.Router();

const authRoutes = require('./authentication.controller');
const recipesRoutes = require('./recipes.controller')
const photoRoutes = require('./photo.controller.js');

router.use('/', authRoutes);
router.use('/recipes', recipesRoutes)
router.use('/pics', photoRoutes)

module.exports = router;
