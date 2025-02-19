// This is for the image uploader

// const express = require("express");
// const multer = require("multer");

// const app = express();
// app.use(express.json());

// // Fix storage settings
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./upload"); // Fix typo (was `cd` instead of `cb`)
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Fix missing `file` param
//   },
// });

// // Fix spelling of `upload`
// const upload = multer({
//   storage: storage,
// });

// app.get("/", (req, res) => {
//   res.send("yes");
// });

// // Fix missing response in `/single` route
// app.post("/single", upload.single("image"), (req, res) => {
//   console.log(req.file); // Fix: `req.body` won’t have file info, use `req.file`
//   res.json({
//     message: "File uploaded successfully",
//     file: req.file,
//   });
// });

// app.listen(6060, () => {
//   console.log("Server is started on port 6060");
// });
