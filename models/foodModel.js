const mongoose = require("mongoose");

const foodSchema = mongoose.Schema(
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
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Foods = mongoose.model("foods", foodSchema);

module.exports = Foods;
