import React, { useContext, useState } from "react";
import "../css/Login.css";

import UserContext from "../context/UserContext";
import ToastContext from "../context/ToastContext";
import Spinner from "../components/Spinner";

export const Login = () => {
  const { toast } = useContext(ToastContext);
  const { loginUser, forgetPassword, loader } = useContext(UserContext);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  //handles input value change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...credentials, [name]: value });
  };

  //handles form data while submit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter all the required fields");
      return;
    }

    loginUser(credentials);
  };

  // handles forgot password button click,checking email entered or not
  const fieldValid = () => {
    if (!credentials.email) {
      toast.error("Please enter email to reset password");
      return;
    } else {
      forgetPassword({ email: credentials.email });
    }
  };

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          <form onSubmit={handleSubmit} autoComplete="none">
            <div className="login-container">
              <h1 className="login-heading">LOGIN</h1>
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
                type="password"
                placeholder="Password"
                name="password"
                className="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
              <input type="submit" value="LOGIN" className="button-54" />
              <a onClick={() => fieldValid()}>Forget Password ?</a>
            </div>
          </form>
        </>
      )}
    </>
  );
};
