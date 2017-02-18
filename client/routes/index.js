var express = require('express');
var router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@172.17.0.2:5432/postgres';

const route = '/api/v1/users';

function get_user(req) {
  const user = {
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    birthday: req.body.birthday
  };
  return user;
}

function user_to_values(user) {
  return [user.name, user.address, user.email, user.birthday]
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


router.post(route, (req, res, next) => {
  const results = [];
  user = get_user(req);
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
    user_to_values(user));
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

router.get(route, (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM users ORDER BY id ASC;');
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

router.put(route + '/:user_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.user_id;
  user = get_user(req);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    values = user_to_values(user);
    values.push(id);
    const action = client.query('UPDATE users SET name=($1), address=($2), email=($3), birthday=($4) WHERE id=($5)', values);
    action.on('error', (error) => {
      console.log('update error:' + error);
      return res.status(500).json({success: false, user: error});
    });
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM users ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('error', (error) => {
      console.log('query error:' + error);
      return res.status(500).json({success: false, user: error});
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.delete(route + '/:user_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.user_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    const action = client.query('DELETE FROM users WHERE id=($1)', [id]);
    action.on('error', (error) => {
      console.log('delete error:' + error);
      return res.status(500).json({success: false, user: error});
    });
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM users ORDER BY id ASC');
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