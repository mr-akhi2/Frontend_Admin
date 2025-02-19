const PORT = 6060;
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const __dirnam = path.resolve();
// console.log(__dirnam);

const nodemailer = require("nodemailer");
const parseTemplate = require("./main");

// importing schemas
const Products = require("./Schemas/AddProduct");
const Users = require("./Schemas/UserSchemea");
const cloudinary = require("./utils/cloudinary");

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "upload", "images");
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// creating uplaod Endpoin for images

// app.use("/images", express.static("./upload/images"));
app.use("/images", express.static(path.join(__dirname, "upload", "images")));

app.post("/upload", upload.single("product"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Upload an image" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    // console.log(result);
    res.status(200).json({ success: true, image_Url: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

//   const path = `http://localhost:${PORT}/images/${req.file.filename}`;
//   // console.log(path);
//   if (!path) {
//     return res.json({
//       success: false,
//       messgae: "upload the image",
//     });
//   }
//   try {
//     const result = await cloudinary.uploader.upload(path);
//     if (result) {
//       res.status(200).json({
//         success: true,
//         image_Url: path,
//       });
//       console.log(result);
//     } else {
//       res.status(401).json({
//         success: false,
//         message: "failed to upload image",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }

//   // console.log(path);
// });

// add product api
// ****************************************************
app.post("/addproduct", async (req, res) => {
  const productid = await Products.find({});
  let id;
  if (productid.length > 0) {
    let last_product_array = productid.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Products({
    id: id,
    name: req.body.name,
    image: req.body.image,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
    category: req.body.category,
  });
  await product.save();
  // console.log(product);
  res.json({
    success: 1,
    status: true,
    data: product,
  });
});

// get all the products
app.get("/allproducts", async (req, res) => {
  const product = await Products.find({});
  if (product.length > 0) {
    res.status(200).json({
      code: 200,
      status: true,
      message: ` users found`,
      error: [],
      data: product,
    });
  } else {
    res.status(200).json({
      code: 200,
      status: true,
      message: ` users found`,
      error: "no product find",
      data: [],
    });
  }
});
// delete data

app.delete("/removeproduct", async (req, res) => {
  let id = req.body.id;
  await Products.findOneAndDelete({ id });
  // console.log(id);
  res.json({
    success: 1,
    delete: id,
  });
});

// Creating Endpoint  for registerin  the user

app.post("/signup", async (req, res) => {
  let findemail = req.body.email;
  let check = await Users.findOne({ email: findemail });
  if (check) {
    return res.status(404).json({
      success: false,
      error: "exixting user found",
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token, username: user.name, email: user.email });
});
//  creating for the userlogin

app.post("/login", async (req, res) => {
  let useremail = await req.body.email;
  let user = await Users.findOne({ email: useremail });
  // console.log(user);
  // console.log(user.password);

  if (user) {
    const passCompo = req.body.password === user.password;
    if (passCompo) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token, user });
    } else {
      res.json({
        success: false,
        error: "wrong password",
      });
    }
  } else {
    res.json({
      success: false,
      error: "Wrong email Id",
    });
  }
});

// for new collections
app.get("/newcollections", async (req, res) => {
  let product = await Products.find({});
  let newcollections = product.slice(1).slice(-8);
  // console.log(newcollections);
  res.send(newcollections);
});

// for women collections
app.get("/popularwomen", async (req, res) => {
  let products = await Products.find({ category: "women" });
  let womencollections = products.slice(0, 4);
  // console.log(womencollections);
  res.send(womencollections);
});

// create a middleware for the add to cart
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "please authentic using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ error: "please athenticate using valid token " });
    }
  }
};

//  add to cart

app.post("/addtocart", fetchUser, async (req, res) => {
  // console.log(req.body, req.user.id);
  let userData = await Users.findOne({ _id: req.user.id });
  // console.log("item ", req.body);
  // console.log("itemid", req.body.item);
  userData.cartData[req.body.item] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

// api  for the remove Product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  let userData = await Users.findOne({ _id: req.user.id });
  // console.log("item ", req.body);
  // console.log("itemid", req.body.item);
  if (userData.cartData[req.body.item] > 0) {
    userData.cartData[req.body.item] -= 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("removed");
  }
});

// create for the cart data

app.post("/getcart", fetchUser, async (req, res) => {
  // console.log(getcart);
  let userData = await Users.findOne({ _id: req.user.id });

  res.json(userData.cartData);
});

//  this is for email

app.post("/sendmail", (req, res) => {
  const user = {
    email: req.body.email,
    date: new Date(Date.now()).toLocaleString(),
  };
  let email1 = user.email;
  let name = email1.replace(/[^a-zA-Z].*$/, "");

  // console.log(user.email, name);

  const emailTemplate = parseTemplate(
    path.join(__dirname, "./nodemailer/index.html"),
    {
      student_name: name,
      plateform_name: "StyleSphere",
      visitedate: user.date,
    }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.USERID,
      pass: process.env.PASSWORD,
    },
  });

  // eyay qzpg cage fvtc

  transporter.sendMail(
    {
      from: "stylesphere108@gmail.com",
      to: user.email,
      subject: "This email for logged in our websites",
      // text : "<h1> Welcome to Node JS Tutorial By Awnish Kumar</h1>",
      html: emailTemplate,
    },
    (error, result) => {
      if (error) {
        res.status(500).json({
          code: 500,
          message: "Email Could not be sent",
          messageID: "",
          status: false,
          error: error,
          data: [],
        });
      } else {
        // console.log("email send");
        res.status(200).json({
          code: 200,
          message: "Email is Send",
          messageID: result.messageId,
          status: true,
          error: [],
          data: [],
        });
      }
    }
  );
});

app.use(express.static(path.join()));
app.use(express.static(path.join(__dirnam, "/Admin/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirnam, "Admin", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server is running in ${PORT}`);
  mongoose
    .connect(process.env.CONNECTEDURL)
    .then(() => {
      console.log("connect succesfully");
    })
    .catch((e) => {
      console.log("failed to connect", e);
    });
});
