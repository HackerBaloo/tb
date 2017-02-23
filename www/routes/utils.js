const express = require('express');
const router = express.Router();
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@postgres:5432/postgres';


function dbconnect(connected) {
  pg.connect(connectionString, connected);
};

function query_users(client, res, done) {
  const results = [];
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

};

module.exports = {

  register: function (operation, url, handler) {
    operation.call(router, url, handler);
  },

  query: function (res, sql, values) {
    dbconnect((err, client, done) => {
      // Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, user: err });
      }
      // SQL Query > Insert User
      const action = client.query(sql, values);
      action.on('error', (error) => {
        console.log('action error:' + error);
        return res.status(500).json({ success: false, error: error });
      });
      query_users(client, res, done);
    });
  },

  handle_req: function (req, res, next) {
    dbconnect((err, client, done) => {
      // Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, user: err });
      }
      query_users(client, res, done);
    });
  },

  get_router: function () {
    return router;
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
  }
}