#!/bin/sh

npm run build && cd public && rm -rf .git && git init && git checkout -b gh-pages && git remote add origin git@github.com:libetl/my-material-gatsby-site.git && git add . && git commit -m "site published" && git push -u origin gh-pages -f
