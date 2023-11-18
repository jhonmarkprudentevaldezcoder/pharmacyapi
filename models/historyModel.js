const mongoose = require("mongoose");

const historySchema = mongoose.Schema(
  {
    userid: {
      type: String,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId, // Assuming you have a Product model
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1, // You can set a default value if needed
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

const History = mongoose.model("History", historySchema);

module.exports = History;
