var utils = require("./utils")
var get = require("./get")
var put = require("./put")
var post = require("./post")
var del = require("./delete")
var router = utils.get_router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile('index.html');
});

module.exports = router;

get.route();
put.route();
post.route();
del.route();
