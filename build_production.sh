#!/bin/sh

rm -rf _site_production

JEKYLL_ENV=production jekyll build -d ./_site_production
