// me endpoint - just returns name and student number

// me.js
var express = require('express');
var router = express.Router();

/* GET /me */
router.get('/', function(req, res, next) {
  res.json({ name: 'Matthew Chambers', studentNumber: 'n11318546' });
});

module.exports = router;