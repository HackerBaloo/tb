#!/bin/bash
folder=~/aws/

cp bootstrap_production.sh $folder
cp Dockerfile $folder
cp -R www/ $folder
cp package.json $folder
cp always.sh $folder
pushd $folder
vagrant plugin install vagrant-ami
vagrant plugin install vagrant-aws
vagrant destroy -f
vagrant up --provider=aws
vagrant create-ami --name www-ami --desc "WWW AMI" --tags role=test,environment=dev
vagrant up
popd
