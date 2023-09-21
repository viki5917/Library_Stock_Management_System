import React, { useState, useEffect, useContext } from "react";

import "../css/Forgetpassword.css";
import UserContext from "../context/UserContext";
import ToastContext from "../context/ToastContext";
import Spinner from "../components/Spinner";

const Forgetpassword = () => {
  const { toast } = useContext(ToastContext);
  const { userDetails, loader, resetPassword, resendOtp } =
    useContext(UserContext);

  const [credentials, setCredentials] = useState({
    userId: userDetails.userId,
    otp: "",
    newpassword: "",
    confirmpassword: "",
  });

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);

  //set timer for resend password
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  //handles input values change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...credentials, [name]: value });
  };

  //handles form submit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !credentials.otp ||
      !credentials.newpassword ||
      !credentials.confirmpassword
    ) {
      toast.error("Please enter all the required fields");
      return;
    }

    if (credentials.newpassword !== credentials.confirmpassword) {
      toast.error("Passwords doesn't match!");
      return;
    }

    const userData = { ...credentials, confirmpassword: undefined };
    resetPassword(userData);
  };

  //resend otp
  const resend = (event) => {
    resendOtp(userDetails);
    setMinutes(1);
    setSeconds(30);
  };

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          {" "}
          <form onSubmit={handleSubmit} autoComplete="none">
            <div className="fp-container">
              <h1 className="fp-heading">Reset Password</h1>
              <input
                type="Number"
                placeholder="Enter OTP"
                name="otp"
                className="otp"
                min="1000"
                max="9999"
                value={credentials.otp}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                name="newpassword"
                className="password"
                value={credentials.newpassword}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                placeholder="Re-Enter Password"
                name="confirmpassword"
                className="password"
                value={credentials.confirmpassword}
                onChange={handleInputChange}
                required
              />
              {seconds > 0 || minutes > 0 ? (
                <p>
                  Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </p>
              ) : (
                <p>Didn't receive OTP?</p>
              )}
              <a
                onClick={resend}
                style={{
                  color: seconds > 0 || minutes > 0 ? "#c5cdd6" : "black",
                  "pointer-events": seconds > 0 || minutes > 0 ? "none" : "",
                }}
              >
                Resend OTP
              </a>
              <input type="submit" value="RESET" className="button-54" />
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Forgetpassword;
