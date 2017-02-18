#!/bin/bash

# sudo npm install -g nodemon
#install Visual Studio Code

wget -o vs_code_amd64.deb https://go.microsoft.com/fwlink/?LinkID=760868
sudo dpkg  -i vs_code_amd64.deb

sudo apt install -y git
sudo apt install -y postgresql-client-common
sudo apt install -y postgresql-client
sudo apt install -y doublecmd-gtk

cd
mkdir src
cd src
git clone https://github.com/HackerBaloo/tb.git
cd tb
./bootstrap.sh