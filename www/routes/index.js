const utils = require("./utils")
const crud = require("./crud")
const router = utils.get_router();

module.exports = router;

utils.register(router.get,    '/', (req, res, next) => {
  res.sendFile('index.html');
});

const api_url = '/api/v1/users';

utils.register(router.get,    api_url,               crud.handle_read);
utils.register(router.put,    api_url + '/:user_id', crud.handle_update);
utils.register(router.post,   api_url,               crud.handle_insert);
utils.register(router.delete, api_url + '/:user_id', crud.handle_delete);
