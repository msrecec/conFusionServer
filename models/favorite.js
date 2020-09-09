const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const favoriteDishSchema = new Schema({
//   favoriteDish: {
//     type: Schema.Types.ObjectId,
//     ref: 'Dish',
//   },
// });

const favoriteSchema = new Schema(
  {
    postAuthor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    favoriteDishes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dish',
      },
    ],
  },
  {
    timestamps: true,
  }
);

let Favorites = mongoose.model('Favorites', favoriteSchema);

module.exports = Favorites;
