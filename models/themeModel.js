const mongoose = require("mongoose");

const themeSchema = mongoose.Schema(
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
    location: {
      type: String,
    },
    reviews: {
      type: String,
    },
    date: {
      type: String,
    },
    deposit: {
      type: String,
    },
    timein: {
      type: String,
    },
    timeout: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Themes = mongoose.model("themes", themeSchema);

module.exports = Themes;
