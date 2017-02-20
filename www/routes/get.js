var utils = require("./utils.js")

module.exports = {
    route: function () {
        const router = utils.get_router();
        const route = utils.route();
        router.get(route, (req, res, next) => {
            const results = [];
            // Get a Postgres client from the connection pool
            utils.dbconnect((err, client, done) => {
                // Handle connection errors
                if (err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err });
                }
                utils.query_users(client, res, results, done);
            });
        });
    }
}