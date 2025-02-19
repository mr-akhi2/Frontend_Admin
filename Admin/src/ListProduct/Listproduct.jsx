import React, { useEffect, useState } from "react";
import "./Listproduct.css";
import cross_icon from "../assets/cart_cross_icon.png";
import { toast } from "react-toastify";
const Listproduct = () => {
  const [allproducts, setallproducts] = useState([]);

  const fetchinfo = async () => {
    await fetch("http://localhost:6060/allproducts")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const setd = data.data;
        setallproducts(setd);
      });
  };

  useEffect(() => {
    fetchinfo();
  }, []);

  const removeproduct = async (id) => {
    // console.log(id);
    await fetch("http://localhost:6060/removeproduct", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data) {
          toast.success("removed product ");
        } else {
          toast.error("failed to removed product ");
        }
      });

    await fetchinfo();
  };
  return (
    <div className="list-product">
      <h1>ALL product List</h1>
      <div className="list-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="list-allproduct">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <div className="list-format-main" key={index}>
              <img src={product.image} className="product_image" />
              <p>{product.name}</p>
              <p>{product.old_price}</p>
              <p>{product.new_price}</p>
              <p>{product.category}</p>
              <img
                onClick={() => {
                  removeproduct(product.id);
                }}
                src={cross_icon}
                className="cross_icon"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Listproduct;
