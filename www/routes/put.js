var utils = require("./utils.js")

module.exports = {
    route: function () {
        const router = utils.get_router();
        const route = utils.route();
        router.put(route + '/:user_id', (req, res, next) => {
            const results = [];
            // Grab data from the URL parameters
            const id = req.params.user_id;
            user = utils.get_user(req);
            // Get a Postgres client from the connection pool
            utils.dbconnect((err, client, done) => {
                // Handle connection errors
                if (err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, data: err });
                }
                // SQL Query > Update Data
                values = utils.user_to_values(user);
                values.push(id);
                const action = client.query('UPDATE users SET name=($1), address=($2), email=($3), birthday=($4) WHERE id=($5)', values);
                action.on('error', (error) => {
                    console.log('update error:' + error);
                    return res.status(500).json({ success: false, user: error });
                });
                utils.query_users(client, res, results, done);
            });
        });
    }
}