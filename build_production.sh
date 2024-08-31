#!/bin/sh

rm -rf _site_production

JEKYLL_ENV=production bundle exec jekyll build -d /tmp/rollerozxa_blog_site_production

rsync -azP --delete /tmp/rollerozxa_blog_site_production/ debian@voxelmanip.se:/srv/voxelmanip/
