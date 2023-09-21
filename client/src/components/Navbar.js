import React, { useState, useContext } from "react";
import "../css/Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import ToastContext from "../context/ToastContext";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => {
    setClick(!click);
  };

  const navigate = useNavigate();

  const { toast } = useContext(ToastContext);
  const { user, setUser, admin, setAdmin } = useContext(UserContext);

  return (
    <>
      <nav>
        <h1>Library</h1>
        <div>
          <ul id="navbar" className={click ? "#navbar active" : "#navbar"}>
            {user ? (
              <>
                <li>
                  <NavLink to="/userhome">Allbooks</NavLink>
                </li>
                <li>
                  <button
                    className="logout-button"
                    onClick={() => {
                      setUser(null);
                      localStorage.clear();
                      toast.success("Logged out Successfully");
                      navigate("/login", { replace: true });
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : admin ? (
              <>
                <li>
                  <NavLink to="/adminhome">AllBooks</NavLink>
                </li>
                <li>
                  <NavLink to="/addbooks">AddBook</NavLink>
                </li>
                <li>
                  <NavLink to="/allusers">Users</NavLink>
                </li>

                <li>
                  <button
                    className="logout-button"
                    onClick={() => {
                      setAdmin(null);
                      localStorage.clear();
                      toast.success("Logged out Successfully");
                      navigate("/login", { replace: true });
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <div id="mobile" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
