// Require needed modules
const express = require('express');
const bodyParser = require('body-parser');

//create router
const dishRouter = express.Router();

// Use the body-parser module to parse data sent
dishRouter.use(bodyParser.json());

//Routes for /dishes - root file

dishRouter
  .route('/')
  .all((req, res, next) => {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    next();
  })
  .get((req, res, next) => {
    res.end('Will send all the dishes to you!');
  })
  .post((req, res, next) => {
    res.end(
      `Will add the dish: ${req.body.name} with details: ${req.body.description}`
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes`);
  })
  .delete((req, res, next) => {
    res.end('Deleting all the dishes!');
  });

//Routes for /dishes/:dishId

dishRouter
  .route('/:dishId')
  .all((req, res, next) => {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    next();
  })
  .get((req, res, next) => {
    res.end(`Will send the details of the dish: ${req.params.dishId} to you`);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
  })
  .put((req, res, next) => {
    res.write(`Updating the dish: ${req.params.dishId}\n`);
    res.end(
      `Will update the dish: ${req.body.name} with details: ${req.body.description}`
    );
  })
  .delete((req, res, next) => {
    res.end(`Deleting dish: ${req.params.dishId}`);
  });

module.exports = dishRouter;
