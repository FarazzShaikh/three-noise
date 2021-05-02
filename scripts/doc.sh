#!/usr/bin/env bash

match="<h2><a href=\"index.html\">Home<\/a><\/h2>"
replace="<h2><a href=\"index.html\">Home<\/a><\/h2><h3><a href=\".\/\example\/index.html\">Demo<\/a><\/h3>"


lineNum=$(grep -n "<h2><a href=\"index.html\">Home</a></h2>" docs/index.html | cut -d: -f1)
sed -i '' "${lineNum}s/$match/$replace/" docs/index.html

cp -R example docs/example