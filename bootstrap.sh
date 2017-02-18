#!/bin/bash

localectl set-locale LANG="en_US.UTF-8"
#Set up the docker repository
# Install packages to allow apt to use a repository over HTTPS
sudo apt install -y --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

# Add Docker’s official GPG key    
curl -fsSL https://apt.dockerproject.org/gpg | sudo apt-key add -    

# set up the stable repository
sudo add-apt-repository \
       "deb https://apt.dockerproject.org/repo/ \
       ubuntu-$(lsb_release -cs) \
       main"
#sudo sh -c 'echo deb https://apt.dockerproject.org/repo ubuntu-trusty main > /etc/apt/sources.list.d/docker.list'

sudo apt update

#install docker
sudo apt -y install docker-engine       
#sudo apt-get purge lxc-docker
#sudo apt-get install linux-image-extra-$(uname -r)
#sudo apt-get install docker-engine
#sudo service docker start

sudo usermod -aG docker $USER

#install git
sudo apt-get -y install git

# install node
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

# add pg for postgres 
npm install pg@6.1.0 --save
npm install --save pg-async

#start postgres
sudo docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres

#create table
node db/models/database.js

# start app container
# docker run --name some-app --link some-postgres:postgres -d application-that-uses-postgres