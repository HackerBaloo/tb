#!/bin/bash
folder=vm/

cp bootstrap_production.sh $folder
cp Dockerfile $folder
cp -R www/ $folder
cp package.json $folder
cp always.sh $folder
pushd $folder
vagrant destroy -f
vagrant up
popd
