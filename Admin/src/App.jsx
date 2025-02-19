import React, { useEffect, useState } from "react";
import Admin from "./pages/Admin";
import Navbar from "./Navbar/Navbar";
import userContext from "./utils/userContext";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [details, setdetails] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    let token = localStorage.getItem("auth-token");
    if (token) {
      return setIsLoggedIn(true);
    } else {
      return setIsLoggedIn(false);
    }
  }, []);

  return (
    <userContext.Provider value={{ ...details, setdetails }}>
      <div>
        <Navbar setLogin={setIsLoggedIn} isLoggedIn={isLoggedIn} />
        <Admin setLogin={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </div>
    </userContext.Provider>
  );
};

export default App;
