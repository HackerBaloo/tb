var utils = require("./utils.js")

module.exports = {
    route: function () {
        const router = utils.get_router();
        const route = utils.route();
        router.post(route, (req, res, next) => {
            const results = [];
            user = get_user(req);
            // Get a Postgres client from the connection pool
            utils.dbconnect((err, client, done) => {
                // Handle connection errors
                if (err) {
                    done();
                    console.log(err);
                    return res.status(500).json({ success: false, user: err });
                }
                // SQL Query > Insert User
                const action = client.query('insert into users (name, address, email, birthday) VALUES ($1,$2,$3,$4)',
                    user_to_values(user));
                action.on('error', (error) => {
                    console.log('insert error:' + error);
                    return res.status(500).json({ success: false, user: error });
                });
                utils.query_users(client, res, reults, done);
            });
        });

    }
}