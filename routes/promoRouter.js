// Require needed modules
const express = require('express');
const bodyParser = require('body-parser');

//create router
const promoRouter = express.Router();

// Use the body-parser module to parse data sent
promoRouter.use(bodyParser.json());

//Routes for /promotions - root file

promoRouter
  .route('/')
  .all((req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
  })
  .get((req, res, next) => {
    res.end(`We will send all the promotions to you!`);
  })
  .post((req, res, next) => {
    res.end(
      `Will add the promotions: ${req.body.name} with details: ${req.body.description}`
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /promotions/`);
  })
  .delete((req, res, next) => {
    res.end('Deleting all promotions');
  });

//Routes for /promotions/:promotionsId

promoRouter
  .route('/:promotionsId')
  .all((req, res, next) => {
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    next();
  })
  .get((req, res, next) => {
    res.end(`Will send details of the promotions ${req.params.promotionsId} to you!`);
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionsId}`)
  })
  .put((req, res, next) => {
    res.write(`Updating the promotions ${req.params.promotionsId}\n`);
    res.end(`Will update promotions: ${req.body.name} with details: ${req.body.description}`);
  })
  .delete((req, res, next) => {
    res.end(`Deleting promotions: ${req.params.promotionsId}`);
  });

  module.exports = promoRouter;
