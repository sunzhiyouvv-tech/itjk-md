#!/bin/bash
set -e

ROOT=/tmp/doocs-md
rm -rf $ROOT

git clone --depth 1 https://github.com/doocs/md.git $ROOT
cd $ROOT

# ITJK branding
find . -type f \( -name '*.js' -o -name '*.ts' -o -name '*.vue' -o -name '*.json' -o -name '*.html' -o -name '*.css' \) -print0 | xargs -0 sed -i \
  -e 's/doocs/ITJK/g' \
  -e 's/Doocs/ITJK/g' \
  -e 's/DOOCS/ITJK/g' \
  -e 's/微信 Markdown 编辑器/IT极客 Markdown 编辑器/g'

npm install
npm run build

cp -r dist $OLDPWD/dist
