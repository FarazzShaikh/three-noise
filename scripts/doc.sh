#!/usr/bin/env bash

match="<h2><a href=\"index.html\">Home<\/a><\/h2>"
replace="<h2><a href=\"index.html\">Home<\/a><\/h2><h3><a href=\".\/\example\/index.html\">Demo<\/a><\/h3>"


lineNum=$(grep -n "<h2><a href=\"index.html\">Home</a></h2>" docs/index.html | cut -d: -f1)



unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

if [ "$machine" = "Mac" ]; then
    sed -i '' "${lineNum}s/$match/$replace/" docs/index.html
else
    sed -i "${lineNum}s/$match/$replace/" docs/index.html
fi

cp -R example docs

mkdir -p docs/build
cp build/three-noise.js docs/build/three-noise.js