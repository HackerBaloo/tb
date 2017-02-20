var express = require('express');
const router = express.Router();
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@postgres:5432/postgres';

module.exports = {

  get_router: function () {
    return router;
  },

  route: function () {
    return '/api/v1/users';
  },

  dbconnect: function (connected) {
    pg.connect(connectionString, connected);
  },

  get_user: function (req) {
    const user = {
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      birthday: req.body.birthday
    };
    return user;
  },

  user_to_values: function (user) {
    return [user.name, user.address, user.email, user.birthday]
  },

  query_users: function (client, res, results, done) {
    cmd = "SELECT id, name, email, age(birthday) as age, to_char(birthday, 'YYYY-MM-DD') as birthday, address FROM users ORDER BY id ASC";
    var query = client.query(cmd);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('error', (error) => {
        console.log('error:' + error);
        done();
        return res.status(500).json({ success: false, error: error });
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });

  }
}