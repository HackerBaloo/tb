#!/bin/bash
folder=vm/

cp bootstrap.sh $folder
cp always.sh $folder
pushd $folder
vagrant up
popd