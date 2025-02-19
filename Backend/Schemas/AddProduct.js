const mongoose = require("mongoose");

const Products = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  old_price: {
    type: Number, // Changed from String to Number
    required: true,
  },
  new_price: {
    type: Number, // Changed from String to Number
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    // Fixed spelling from "avilable" to "available"
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Products", Products);
