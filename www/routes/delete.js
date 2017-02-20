var utils = require("./utils.js")

module.exports = {
    route: function () {
        const router = utils.get_router();
        const route = utils.route();
        router.delete(route + '/:user_id', (req, res, next) => {
            const results = [];
            // Grab data from the URL parameters
            const id = req.params.user_id;
            // Get a Postgres client from the connection pool
            utils.dbconnect((err, client, done) => {
                // Handle connection errors
                if (err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err });
                }
                // SQL Query > Delete Data
                const action = client.query('DELETE FROM users WHERE id=($1)', [id]);
                action.on('error', (error) => {
                    console.log('delete error:' + error);
                    return res.status(500).json({ success: false, user: error });
                });
                utils.query_users(client, res, reults, done);
            });
        });
    }
}