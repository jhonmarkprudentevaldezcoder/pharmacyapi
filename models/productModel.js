const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true, "Please enter first name"],
    },
    Description: {
      type: String,
      required: [true, "Please enter last name"],
    },
    Price: {
      type: String,
      required: [true, "Please enter email"],
    },
    Stock: {
      type: String,
      required: [true, "Please enter password"],
    },
    Image: {
      type: String,
      required: [true, "Please enter password"],
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("products", productSchema);

module.exports = Products;
