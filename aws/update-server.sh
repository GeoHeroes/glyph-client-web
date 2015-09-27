#!/bin/bash
. ~/.nvm/nvm.sh

git pull origin master;
nvm use 4.1.1;
gulp sass;
gulp build;
forever restart server.js;
