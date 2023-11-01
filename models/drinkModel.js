const mongoose = require("mongoose");

const drinkSchema = mongoose.Schema(
  {
    category: {
      type: String,
    },
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    status: {
      default: "available",
      type: String,
    },
    description: {
      type: String,
    },
    reviews: {
      default: "0.0",
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Drinks = mongoose.model("drinks", drinkSchema);

module.exports = Drinks;
