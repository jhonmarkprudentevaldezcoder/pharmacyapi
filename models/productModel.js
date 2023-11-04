const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Description: {
      type: String,
    },
    Price: {
      type: String,
    },
    Stock: {
      type: String,
    },
    Image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", productSchema);

module.exports = Product;
