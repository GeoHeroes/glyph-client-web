#!/bin/bash
. ~/.nvm/nvm.sh

nvm use 4.1.1;
gulp sass;
gulp build;
forever start server.js;

