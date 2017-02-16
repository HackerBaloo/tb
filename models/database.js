const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:mysecretpassword@172.17.0.2:5432/postgres';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'DROP TABLE users;\
  CREATE TABLE users(\
	  id SERIAL PRIMARY KEY\
  	, name text\
  	, address text\
  	, email text UNIQUE not null\
  	, birthday date not null\
  )');
query.on('end', () => { client.end(); });