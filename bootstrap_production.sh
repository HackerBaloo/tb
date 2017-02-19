#!/bin/bash

localectl set-locale LANG="en_US.UTF-8"

cp /vagrant/.pgpass .

cd /vagrant/

#install postgres client
sudo apt install -y postgresql-client-common
sudo apt install -y postgresql-client

#start postgres
docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres

# create users table
psql -h 172.17.0.2 -U postgres -c "CREATE TABLE users(id SERIAL PRIMARY KEY, name text, address text, email text UNIQUE not null, birthday date not null);"

#www
docker build -t www .

docker run -p 3030:3030 --name www --link postgres:postgres -d www