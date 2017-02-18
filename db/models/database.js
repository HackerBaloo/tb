const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@172.17.0.2:5432/postgres';

const client = new pg.Client(connectionString);
client.connect();

const testUsers = [
	{name: "Björn Carlsson", address: "Törnskatevägen 2\n23170 Anderslöv", email: "not.bjorn.carlsson@gmail.com", birthday: "1969-03-05"},
	{name: "Lina Repsson", address: "Repslagarvägen 47\n29933 Wire", email: "lina.repsson@gmail.com", birthday: "1988-06-09"},
	{name: "Adam Adamsson", address: "NumberOne Street 2\zxy Boston", email: "adam.adamsson@gmail.com", birthday: "1961-01-01"},
	{name: "Bertil Byggare", address: "Storgatan 3\n23170 Kiruna", email: "bertil.byggare@gmail.com", birthday: "1967-07-05"},
	{name: "Stina Sträng", address: "Fiolvägen 77\n99231 Cello", email: "stina.strang@gmail.com", birthday: "1992-02-28"},
];
cmd = 'DROP TABLE IF EXISTS users;\
  CREATE TABLE users(\
	  id SERIAL PRIMARY KEY\
  	, name text\
  	, address text\
  	, email text UNIQUE not null\
  	, birthday date not null\
  );';
for(user = 0; user < testUsers.length, user++){
	cmd += 'insert into users (name, address, email, birthday) VALUES ($1,$2,$3,$4)'
}
const query = client.query(cmd);
query.on('end', () => { client.end(); });

