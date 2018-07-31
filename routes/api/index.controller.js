const express = require('express');
const router  = express.Router();

const authRoutes = require('./authentication.controller');
const recipesRoutes = require('./recipes.controller')

router.use('/', authRoutes);
router.use('/recipes', recipesRoutes)

module.exports = router;
