const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile.js'));

// GET user profile
router.get('/user/:email/profile', function(req, res) {
  const email = req.params.email;

  // Verify JWT token
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Handle the error: either the Authorization header is not provided,
    // or it doesn't start with "Bearer "
    res.status(401).json({ error: true, message: 'Authorization header must be provided in the format Bearer <token>' });
    return;
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'd86ea562be5d32579ccd518d9df22d48d070f6c59db27ef4fe8ba5bb0a73f455d39be55542b93b7cf8d3555f59c6bbf0d035fcddd8722d94077af225144edffe', function(err, decoded) {
    if (err) {
      console.log(err);
      // Fetch user profile from database using email without address and dob
      knex('users').where({ email: email }).select('email', 'firstName', 'lastName')
        .then(userProfile => {
          if (userProfile) {
            res.json(userProfile);
          } else {
            res.status(404).json({ error: true, message: `Profile with email: ${email} not found.` });
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: true, message: 'Database query failed.' });
        });
    } else {
      // Fetch user profile from database using email with address and dob
      knex('users').where({ email: email }).select('email', 'firstName', 'lastName', 'dob', 'address')
        .then(userProfile => {
          if (userProfile) {
            res.json(userProfile);
          } else {
            res.status(404).json({ error: true, message: `Profile with email: ${email} not found.` });
          }
        })
        .catch(err => {
          res.status(500).json({ error: true, message: 'Database query failed.' });
        });
    }
  });
});

router.put('/user/:email/profile', function(req, res) {
    const email = req.params.email;
    const updatedData = req.body;
  
    // Update the user profile in the database using the provided email and data
    knex('users').where({ email: email }).update(updatedData)
      .then(() => {
        res.json({ message: `Profile with email: ${email} has been updated.` });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: true, message: 'Database update failed.' });
      });
  });

module.exports = router;