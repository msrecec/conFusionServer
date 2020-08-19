// Require needed modules
const express = require('express');
const bodyParser = require('body-parser');

//create router
const leaderRouter = express.Router();

// Use the body-parser module to parse data sent
leaderRouter.use(bodyParser.json());

//Routes for /leaders - root file

leaderRouter
  .route('/')
  .all((req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
  })
  .get((req, res, next) => {
    res.end(`Will send all the leaderships to you!`);
  })
  .post((req, res, next) => {
    res.end(
      `Will add the leaderships: ${req.body.name} with details: ${req.body.description}`
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders/');
  })
  .delete((req, res, next) => {
    res.end('Deleting all leaderships');
  });

//Routes for /leaders/:leaderId

leaderRouter
  .route('/:leaderId')
  .all((req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
  })
  .get((req, res, next) => {
    res.end(
      `Will send details of the leader: ${req.params.leaderId}\n`
    );
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /leaders/${req.params.leaderId}`
    );
  })
  .put((req, res, next) => {
    res.write(`Updating the leader: ${req.params.leaderId}\n`);
    res.end(
      `Will update the leader: ${req.body.name} with details: ${req.body.description}`
    );
  })
  .delete((req, res, next) => {
    res.end(`Deleting leader: ${req.params.leaderId}`);
  });

module.exports = leaderRouter;
