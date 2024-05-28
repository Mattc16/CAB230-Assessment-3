var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/* POST /user/login */
router.post('/', function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    });
  }

  req.db.from('users')
    .select('*')
    .where('email', email)
    .then((users) => {
      if (users.length === 0) {
        return res.status(401).json({
          "error": true,
          "message": "Incorrect email or password"
        });
      }

      const user = users[0];

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          "error": true,
          "message": "Incorrect email or password"
        });
      }
;
      const expiresIn = 86400; // Token expires in 24 hours

      const token = jwt.sign({ email: user.email }, 'd86ea562be5d32579ccd518d9df22d48d070f6c59db27ef4fe8ba5bb0a73f455d39be55542b93b7cf8d3555f59c6bbf0d035fcddd8722d94077af225144edffe', { expiresIn: expiresIn });

      return res.status(200).json({
        "token": token,
        "token_type": "Bearer",
        "expires_in": expiresIn
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({"Error" : true, "Message" : "Error in MySQL query"});
    });
});

module.exports = router;