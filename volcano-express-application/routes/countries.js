// Countries Endpoint - will get all counties from the database

// countries.js
var express = require('express');
var router = express.Router();

/* GET /countries */
router.get('/', function(req, res, next) {
  req.db.from('data').distinct('country')
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.json({"Error" : true, "Message" : "Error in MySQL query"});
    });
});

module.exports = router;