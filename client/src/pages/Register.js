import React, { useContext, useState } from "react";
import "../css/Register.css";

import ToastContext from "../context/ToastContext";
import UserContext from "../context/UserContext";
import Spinner from "../components/Spinner";

const Register = () => {
  const { toast } = useContext(ToastContext);
  const { registerUser, loader } = useContext(UserContext);

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmpassword: "",
  });

  //handles input value change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...credentials, [name]: value });
  };

  //handles form value submit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.address ||
      !credentials.phone ||
      !credentials.password ||
      !credentials.confirmpassword
    ) {
      toast.error("Please enter all the required fields");
      return;
    }

    if (credentials.password !== credentials.confirmpassword) {
      toast.error("Passwords does not match");
      return;
    }
    const userData = { ...credentials, confirmpassword: undefined };
    registerUser(userData);
  };

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          <form onSubmit={handleSubmit} autoComplete="none">
            <div className="register-container">
              <h1 className="register-heading">REGISTER</h1>
              <input
                type="text"
                placeholder="Name"
                name="name"
                className="name"
                value={credentials.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="email"
                value={credentials.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                placeholder="Address"
                name="address"
                className="address"
                value={credentials.address}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                name="phone"
                className="phone"
                pattern="[0-9]{10}"
                value={credentials.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />

              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmpassword"
                value={credentials.confirmpassword}
                className="confirmpassword"
                onChange={handleInputChange}
                required
              />
              <input type="submit" value="SIGNUP" className="button-54" />
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Register;
