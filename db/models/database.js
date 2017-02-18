const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@172.17.0.2:5432/postgres';

const testUsers = [
	{name: "Björn Carlsson", address: "Törnskatevägen 2\n23170 Anderslöv", email: "not.bjorn.carlsson@gmail.com", birthday: "1969-03-05"},
	{name: "Lina Repsson", address: "Repslagarvägen 47\n29933 Wire", email: "lina.repsson@gmail.com", birthday: "1988-06-09"},
	{name: "Adam Adamsson", address: "NumberOne Street 2\zxy Boston", email: "adam.adamsson@gmail.com", birthday: "1961-01-01"},
	{name: "Bertil Byggare", address: "Storgatan 3\n23170 Kiruna", email: "bertil.byggare@gmail.com", birthday: "1967-07-05"},
	{name: "Stina Sträng", address: "Fiolvägen 77\n99231 Cello", email: "stina.strang@gmail.com", birthday: "1992-02-28"},
];

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

function insertUser(client, user) {
	console.log('Inserting user: ' + user.name);
	const cmd = 'insert into users (name, address, email, birthday) VALUES ($1,$2,$3,$4)';
	return client.query(cmd, [user.name, user.address, user.email, user.birthday]);
}

function insertUsers(client){
	asyncLoop(testUsers.length,function(loop) {
		console.log('Adding user: ' + loop.iteration());
		user = testUsers[loop.iteration()];
		query = insertUser(client, user);
		query.on('error', (error) => {
			console.log("Error inserting user: " + user.name);
			throw error;
		});
		query.on('end', (result) => {
			// console.log(result);
			loop.next();
		});
	}, () => { closeConnection(client) });
}

function closeConnection(client) {
	console.log("closing connection");
	client.end();
}

function createTable(client) {
	console.log("creating table");
	const cmd = 'DROP TABLE IF EXISTS users;\
	CREATE TABLE users(\
		id SERIAL PRIMARY KEY\
		, name text\
		, address text\
		, email text UNIQUE not null\
		, birthday date not null\
	);';
	return client.query(cmd);
}


function main() {
	const client = new pg.Client(connectionString);
	client.connect();
	createTable(client).on('end', () => {
		insertUsers(client);
	});
}

main();