#!/bin/bash

files=("README.md" "config.json" "strings" "assets" "main.js" "scripts")
name="wordstorm"
readme="README.md"

mkdir ${name}
for file in ${files[@]}
do
	cp -rf $file ${name}/$file
done
zip -r -X ${name}/${name}.zip ${name}
mv ${name} ../tmp
git checkout master
rm -rf *
cp ../tmp/${name}.zip ./
cp ../tmp/${readme} ./
rm -rf ../tmp
git commit -a -m "fix"
git push origin master