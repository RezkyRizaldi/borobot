const express = require('express');

const server = express();

server.all('/', (res) => res.send('Result: OK!'));

function keepAlive() {
  server.listen(3000);
}

module.exports = keepAlive;
