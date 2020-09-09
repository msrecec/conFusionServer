// Require needed modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

//query of all items to populate
const populateQuery = [{ path: 'postAuthor' }, { path: 'favoriteDishes' }];

const Favorites = require('../models/favorite');
const Dishes = require('../models/dishes');

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
    const userId = req.user._id;
    Favorites.findOne({
      postAuthor: userId,
    })
      .populate(populateQuery)
      // .populate('postAuthor')
      // .populate('favoriteDishes')
      .then(
        (fav) => {
          if (!fav) {
            console.log(userId);
            console.log('Favorites are empty.');
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.json(fav);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    const userId = req.user._id;
    const dishes = req.body;
    Favorites.findOne({ postAuthor: userId }).then((fav) => {
      console.log(fav);
      if (fav) {
        const favDishes = fav.favoriteDishes;
        console.log('Fav is: ', fav);
        console.log('Dishes in Body: ', dishes);
        console.log('Dishes in Favorite Dishes: ', favDishes);
        // for (let dish of dishes) {
        //   if (favDishes.indexOf(dish._id) === -1) {
        //     favDishes.push(dish._id);
        //   }
        // }
        // dishes.map(dish => {
        //   if(favDishes.indexOf(dish._id) === -1) {
        //     favDishes.push(dish._id);
        //   }
        // })
        let dishFlag = false;
        dishes.forEach((dish) => {
          if (favDishes.indexOf(dish._id) === -1) {
            favDishes.push(dish._id);
            dishFlag = true;
          }
        });
        if (dishFlag) {
          fav
            .save()
            .then(
              (fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                console.log('Updated favorite dish: ', fav);
                return res.json(fav);
              },
              (err) => next(err)
            )
            .catch((err) => {
              next(err);
            });
        } else {
          res.statusCode = 200;
          res.end('No updates needed');
        }
      } else {
        console.log(userId);
        console.log(dishes);
        Favorites.create({
          postAuthor: userId,
          favoriteDishes: dishes.map((el) => el._id),
        })
          .then(
            (fav) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              console.log('Created favorite dishes: ', fav);
              return res.json(fav);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
  })
  .delete((req, res, next) => {
    const userId = req.user._id;
    Favorites.findOneAndRemove(
      {
        postAuthor: userId,
      },
      (err, fav) => {
        if (err) {
          return next(err);
        }
        if (fav) {
          return res.json(fav);
        } else {
          res.statusCode = 404;
          res.end('No such file in favorites!');
        }
      }
    );
  });

favoriteRouter
  .route('/:dishId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .all(cors.corsWithOptions, authenticate.verifyUser)
  .get((req, res, next) => {
    // const userId = req.user._id;
    // const dishId = req.body._id;
    console.log('This is dish id', req.params.dishId);
    const dishIdLookup = req.params.dishId;
    Favorites.findOne({ postAuthor: req.user._id })
      .populate(populateQuery)
      .then(
        (fav) => {
          if (!fav) {
            res.statusCode = 404;
            res.end(`Favorite dishes do not exist!`);
          } else {
            const foundDishIndex = fav.favoriteDishes.findIndex(
              (f) => f._id == dishIdLookup
            );
            console.log('foundDishIndex ', foundDishIndex);
            if (foundDishIndex < 0) {
              res.status = 200;
              return res.end("Dish doesn't exist");
            } else {
              res.status = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.json(fav.favoriteDishes[foundDishIndex]);
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
  })
  .post((req, res, next) => {
    const userId = req.user._id;
    const dishId = req.params.dishId;
    Favorites.findOne({ postAuthor: userId }).then((fav) => {
      if (fav) {
        if (fav.favoriteDishes.indexOf(dishId) === -1) {
          fav.favoriteDishes.push(dishId);
          fav.save().then(
            (fav) => {
              Favorites.findById(fav._id)
                .populate(populateQuery)
                .then((fav) => {
                  const addedDish =
                    fav.favoriteDishes[fav.favoriteDishes.length - 1];
                  res.status = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.json(addedDish);
                });
            },
            (err) => {
              next(err);
            }
          );
        } else {
          res.status = 200;
          res.end('Dish has already been added!');
        }
      } else {
        Favorites.create({ postAuthor: userId, favoriteDishes: [dishId] });
      }
    });
  })
  .delete((req, res, next) => {
    const userId = req.user._id;
    const dishId = req.params.dishId;
    Favorites.updateOne(
      { postAuthor: userId },
      { $pullAll: { favoriteDishes: [dishId] } },
      (err) => next(err)
    )
      .then(
        (fav) => {
          if (fav) {
            res.status = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json(fav);
          } else {
            res.statusCode = 404;
            res.end('No such file in favorites!');
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
