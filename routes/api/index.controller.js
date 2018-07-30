const express = require('express');
const router  = express.Router();

const authRoutes = require('./authentication.controller');

router.use('/', authRoutes);

module.exports = router;
