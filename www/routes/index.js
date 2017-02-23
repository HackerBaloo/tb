var utils = require("./utils")
var crud = require("./crud")
var router = utils.get_router();

module.exports = router;

utils.register('get',    '/', (req, res, next) => {
  res.sendFile('index.html');
});

const api_url = '/api/v1/users';

utils.register('get',    api_url,               crud.handle_read);
utils.register('put',    api_url + '/:user_id', crud.handle_update);
utils.register('post',   api_url,               crud.handle_insert);
utils.register('delete', api_url + '/:user_id', crud.handle_delete);
