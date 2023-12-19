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
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 0; // Check if the value is greater than or equal to 0
        },
        message: "invalid price",
      },
    },
    Stock: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 0; // Check if the value is greater than or equal to 0
        },
        message: "invalid stock",
      },
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
