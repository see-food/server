const express = require('express');
const router  = express.Router();

const authRoutes = require('./authentication.controller');
const recipesRoutes = require('./recipes.controller')
const mealdbRoutes = require('./mealdb.controller.js');
const photoRoutes = require('./photo.controller.js');

router.use('/', authRoutes);
router.use('/recipes', recipesRoutes)
router.use('/mealdb', mealdbRoutes)
router.use('/pics', photoRoutes)

module.exports = router;
