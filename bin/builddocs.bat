@echo off
echo Git reset?
git reset ./docs/api/

echo removing old data..
rm -rf docs/api/
echo running config.rb
docs\lib\config.rb

echo Running finddoccomments
docs\lib\findocomments.rb

echo Compiling documentation
jsduck ./core/dist/dreem.js ./docs/classdocs/*.js --tags ./docs/lib/custom_tags.rb --guides=./docs/guides.json --categories=./docs/categories.json --output=./docs/api/ --eg-iframe=jsduck_iframe.html --title="Dreem API documentation" --footer="Copyright (c) 2014-2015 Teem2 LLC"

echo Rebuilding source docs
docs\lib\buildsourcedocs.rb

cp ./docs/gitattributes-tmpl ./docs/api/.gitattributes

