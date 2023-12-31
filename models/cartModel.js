const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    userid: {
      type: String,
    },
    userContact: {
      type: String,
    },
    Orderstatus: {
      type: String,
      default: "NOT DELIVERED", // You can set a default value if needed
    },
    products: [
      {
        userEmail: {
          type: String,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId, // Assuming you have a Product model
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1, // You can set a default value if needed
        },
        Orderstatus: {
          type: String,
          default: "NOT DELIVERED", // You can set a default value if needed
        },
        productName: {
          type: String,
        },
        totalPrice: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0, // You can set a default value if needed
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", productSchema);

module.exports = Cart;
