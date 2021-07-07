const express = require('express');
const server = express();

const dataBaseRouter = require('./users/userRouter');
server.use(express.json());

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/users',logger, dataBaseRouter);


//custom middleware

//logger()
function logger(req, res, next) {
  const today = new Date().toISOString();
  console.log(`[${today}] ${req.method} to ${req.url}`);
  next();
}


module.exports = server;
