const { v2 } = require("cloudinary");
const cloudinary = v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "dyanneafd",
  api_key:"913954779263274",
  api_secret: "D3TDQK1duS56L9usJ0UM4gyW2bA",
});

module.exports = cloudinary;
