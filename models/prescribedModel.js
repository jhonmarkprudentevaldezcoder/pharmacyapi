const mongoose = require("mongoose");

const prescribedSchema = mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Quantity: {
      type: String,
    },
    TransactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Prescribed = mongoose.model("prescribed", prescribedSchema);

module.exports = Prescribed;
