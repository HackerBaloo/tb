#!/bin/bash
folder=dev_vm/

cp bootstrap.sh $folder
cp developer.sh $folder
cp always.sh $folder
pushd $folder
vagrant up
popd


