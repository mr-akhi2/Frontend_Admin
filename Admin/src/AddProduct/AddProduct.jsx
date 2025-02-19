import React, { useState } from "react";
import "./Addproduct.css";
import upload from "../assets/upload.jpg";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [image, setimage] = useState(false);
  const [AddData, SetAddData] = useState("ADD");
  const [productdetails, setproductdetails] = useState({
    name: "",
    image: "",
    category: "",
    new_price: "",
    old_price: "",
  });

  const imagehandler = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    setimage(file);
    if (file) {
      setimage(file);
    }
  };

  const changehandler = (e) => {
    setproductdetails({ ...productdetails, [e.target.name]: e.target.value });
  };

  const AddProduct = async () => {
    SetAddData("loading...");
    let responseData;
    let product = productdetails;

    let formData = new FormData();
    formData.append("product", image);

    try {
      const uploadResponse = await fetch("http://localhost:6060/upload", {
        method: "POST",
        body: formData,
      });

      responseData = await uploadResponse.json();
      console.log(responseData);

      if (responseData) {
        setproductdetails({
          name: "",
          image: "",
          category: "",
          new_price: "",
          old_price: "",
        });
      }

      product.image = responseData.image_Url;

      if (responseData.image_Url) {
        const addProductController = new AbortController();
        const addProductTimeout = setTimeout(
          () => addProductController.abort(),
          10000
        ); // 10 sec timeout

        const productResponse = await fetch(
          "http://localhost:6060/addproduct",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
            signal: addProductController.signal, // Timeout controller add kiya
          }
        );

        const productData = await productResponse.json();
        productData.success
          ? toast.success("Product added")
          : toast.error("Failed to upload");

        clearTimeout(addProductTimeout);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timeout, please try again.");
        toast.error("Request timeout, please try again.");
      } else {
        console.error("Error:", error);
        toast.error("Something went wrong.");
      }
    } finally {
      SetAddData("ADD");
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productdetails.name}
          onChange={changehandler}
          type="text"
          name="name"
          placeholder="type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productdetails.old_price}
            onChange={changehandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer-Price</p>
          <input
            value={productdetails.new_price}
            onChange={changehandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productdetails.category}
          onChange={changehandler}
          name="category"
          className="add-product-selector"
        >
          <option selected>Choose</option>
          <option value="men">men</option>
          <option value="women">women</option>
          <option value="kids">kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield upload-image">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload}
            className="upload-image"
          />
        </label>
        <input
          onChange={imagehandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button className="addproduct-btn" onClick={AddProduct}>
        {AddData}
      </button>
    </div>
  );
};

export default AddProduct;
