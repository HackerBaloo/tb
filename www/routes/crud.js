var utils = require("./utils.js")

  function get_user(req) {
    const user = {
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      birthday: req.body.birthday
    };
    return user;
  };

  function user_to_values(user) {
    return [user.name, user.address, user.email, user.birthday]
  };


module.exports = {

  handle_read: function (req, res, next) {
    return utils.handle_req(req, res);
  },
  handle_insert: function (req, res, next) {
    user = get_user(req);
    utils.query(res, 'insert into users (name, address, email, birthday) VALUES ($1,$2,$3,$4)', user_to_values(user));
  },
  handle_update: function (req, res, next) {
    const id = req.params.user_id;
    const user = get_user(req);
    values = user_to_values(user);
    values.push(id);
    utils.query(res, 'UPDATE users SET name=($1), address=($2), email=($3), birthday=($4) WHERE id=($5)', values);
  },
  handle_delete: function (req, res, next) {
    const id = req.params.user_id;
    utils.query(res, 'DELETE FROM users WHERE id=($1)', [id]);
  },
}
