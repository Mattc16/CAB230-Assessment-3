var express = require('express');
var router = express.Router();

/* GET /volcanoes */
router.get('/', function(req, res, next) {
  const { country, populatedWithin } = req.query;

  let query = req.db.from('data').select('id', 'name', 'country', 'region', 'subregion').where('country', country);

  switch (populatedWithin) {
    case '5':
      query = query.where('population_5km', '>', 0);
      break;
    case '10':
      query = query.where('population_10km', '>', 0);
      break;
    case '30':
      query = query.where('population_30km', '>', 0);
      break;
    case '100':
      query = query.where('population_100km', '>', 0);
      break;
    default:
      break;
  }

  query.then((rows) => {
    res.json(rows);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ error: true, message: "Error in MySQL query" });
  });
});

module.exports = router;