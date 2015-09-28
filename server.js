var express = require('express');
var server = express();

var port = process.env.PORT || 3001;

server.use(express.static('public'));
server.listen(port, function() {
  console.log('Listening on port: ', port);
});

