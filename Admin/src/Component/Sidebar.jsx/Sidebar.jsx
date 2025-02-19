import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";
import product_list from "../../assets/product_list.jpg";
import add_product from "../../assets/add_product.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product} className="image" />
          <p>Add Product </p>
        </div>
      </Link>
      <Link to={"/listproduct "} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img className="image" src={product_list} />
          <p>ProductList </p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
