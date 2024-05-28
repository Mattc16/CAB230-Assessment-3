var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET /volcano/{id} */
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  const token = req.headers['authorization'];

  let query = req.db.from('data').select('id', 'name', 'country', 'region', 'subregion', 'last_eruption', 'summit', 'elevation', 'latitude', 'longitude').where('id', id);

  new Promise((resolve, reject) => {
    if (Object.keys(req.query).length > 0) {
      reject({ status: 400, error: true, message: "Invalid query parameters. Query parameters are not permitted." });
    } else if (token) {
      jwt.verify(token, 'd86ea562be5d32579ccd518d9df22d48d070f6c59db27ef4fe8ba5bb0a73f455d39be55542b93b7cf8d3555f59c6bbf0d035fcddd8722d94077af225144edffe', function(err, decoded) {
        if (err) {
          reject({ status: 401, error: true, message: "Invalid JWT token" });
        } else {
          query = query.select('population_5km', 'population_10km', 'population_30km', 'population_100km');
          resolve();
        }
      });
    } else {
      resolve();
    }
  })
  .then(() => {
    return query.then((rows) => {
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ error: true, message: `Volcano with ID: ${id} not found.` });
      }
    });
  })
  .catch((err) => {
    console.log(err);
    if (typeof err === 'object') {
      res.status(err.status).json(err);
    } else {
      res.status(500).json({ error: true, message: "Error in MySQL query" });
    }
  });
});

module.exports = router;