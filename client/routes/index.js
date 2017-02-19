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

function query_users(client){
    cmd = "SELECT id, name, email, age(birthday) as age, to_char(birthday, 'YYYY-MM-DD') as birthday, address FROM users ORDER BY id ASC";
    return client.query(cmd);
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile('index.html');
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
    const action = client.query('insert into users (name, address, email, birthday) VALUES ($1,$2,$3,$4)',
    user_to_values(user));
    action.on('error', (error) => {
      console.log('insert error:' + error);
      return res.status(500).json({success: false, user: error});
    });
    // SQL Query > Select User
    const query = query_users(client);
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
    const query = query_users(client);
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
    const query = query_users(client);
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
    const query = query_users(client);
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