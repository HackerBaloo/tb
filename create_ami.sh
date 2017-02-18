#!/bin/bash

folder=vm/

cp bootstrap.sh $folder
cp always.sh $folder
pushd $folder
vagrant plugin install vagrant-ami
vagrant up --provider=aws
vagrant create-ami --name my-ami --desc "My AMI" --tags role=test,environment=dev
popd
