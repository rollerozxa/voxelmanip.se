#!/bin/sh

rm -rf _site_production

JEKYLL_ENV=production bundle exec jekyll build -d ./_site_production

rsync -azP --delete _site_production/ debian@voxelmanip.se:/srv/voxelmanip/
