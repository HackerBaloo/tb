var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@172.17.0.2:5432/postgres';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


router.post('/api/v1/users', (req, res, next) => {
  const results = [];
  // Grab user from http request
  const user = {
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    birthday: req.body.birthday
  };
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, user: err});
    }
    // SQL Query > Insert User
    client.query('insert into users (name, address, email, birthday) VALUES ($1,$2,$3,$4)',
    [user.name, user.address, user.email, user.birthday]);
    // SQL Query > Select User
    const query = client.query('SELECT * FROM users ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});
