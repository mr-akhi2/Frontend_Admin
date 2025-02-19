import "./Navbar.css";
// import nav_logo from "../assets/logo_big.png";
import navprofile from "../assets/profile.jpg";
import navprofilef from "../assets/StyleSphere.jpg";
import { Link } from "react-router-dom";
import { useContext, useRef } from "react";
import { toast } from "react-toastify";
import userContext from "../utils/userContext";

const Navbar = ({ isLoggedIn }) => {
  const user = useContext(userContext);
  // console.log(user);

  const profile_dashboard = useRef();
  const clickHandler = () => {
    if (profile_dashboard.current.style.display === "none") {
      profile_dashboard.current.style.display = "block";
    } else {
      profile_dashboard.current.style.display = "none";
    }
  };
  return (
    <div className="navbar">
      <div className="nav_logo_container">
        <img src={navprofilef} className="nav_logo" />
      </div>
      <div class="profile-dashboard" ref={profile_dashboard}>
        <h2 style={{ textDecoration: "underline" }}>Your profile</h2>
        <div class="profile-header"></div>
        <ul class="profile-options">
          <li>{user?.name || "username"}</li>
          <li>{user?.email || "email"}</li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("auth-token");
                toast.success("Signout Successfully");
                setTimeout(() => {
                  window.location.replace("/");
                }, 1000);
              }}
              class="logout-btn"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
      {isLoggedIn ? (
        <img onClick={clickHandler} src={navprofile} className="nav_profile" />
      ) : (
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
