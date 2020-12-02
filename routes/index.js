const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  const options = {
    regions
  };

  res.render('index', options);
});

module.exports = router;
