const express = require('express');
const router  = express.Router();

const apiRoutes = require('./api/index.controller');

router.use('/api', apiRoutes);

router.use('*', (req, res) => {
  res.render('./public/index.html')
})

module.exports = router;
