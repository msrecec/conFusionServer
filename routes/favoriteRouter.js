// Require needed modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

//query of all items to populate
const populateQuery = [
  { path: 'favoriteDishes.favoriteDish' },
  { path: 'postAuthor' },
];

const Favorites = require('../models/favorite');

//create router
const favoriteRouter = express.Router();

// Use the body-parser module to parse data sent
favoriteRouter.use(bodyParser.json());

//Routes for /favorite - root file

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .all(cors.corsWithOptions, authenticate.verifyUser)
  .get((req, res, next) => {
    const userId = req.decoded._id ? req.decoded._id : req.user._id;
    Favorites.findOne({
      postAuthor: userId,
    })
      .populate(populateQuery)
      .then(
        (fav) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(fav);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    const userId = req.decoded._id ? req.decoded._id : req.user._id;
    const dishId = req.body._id;
    Favorites.findOne({ postAuthor: userId }, (err, fav) => {
      if (err) {
        next(err);
      }
      if (fav === null) {
        Favorites.create({}, (err, fav) => {
          if (err) {
            next(err);
          }
          fav.postAuthor = userId;
          fav.dishes.push(req.body._id); //dish id
          fav.save(function (err, fav) {
            if (err) {
              next(err);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(fav);
          });
        });
      } else {
        Favorites.findOne(
          {
            postedBy: {
              _id: userId,
            },
          },
          (err, fav) => {
            if (err) {
              next(err);
            }
            let index = fav.favoriteDishes.indexOf(dishId);
            if (index === -1) {
              fav.favoriteDishes.push(dishId);
              fav.save((err, fav) => {
                if (err) {
                  next(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
              });
            } else {
              res.statusCode = 409;
              res.end(`Dish has already been added!`);
            }
          }
        );
      }
    });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
  })
  .delete((req, res, next) => {
    const userId = req.decoded._id ? req.decoded._id : req.user._id;
    Favorites.findOneAndRemove(
      {
        postAuthor: {
          _id: userId,
        },
      },
      (err, fav) => {
        if (err) {
          return next(err);
        }
        res.json(fav);
      }
    );
  });

// favoriteRouter.route('/:dishId')
// .all(cors.corsWithOptions, authenticate.verifyUser)

module.exports = favoriteRouter;