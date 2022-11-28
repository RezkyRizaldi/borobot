const express = require('express');
const server = express();

server.all('/', (req, res) => {
  res.send('Result: OK!');
});

function keepAlive() {
  server.listen(3000, () => console.log(`Server is now ready: | ${Date.now()}`));
}

module.exports = keepAlive;