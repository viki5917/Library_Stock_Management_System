import React, { useContext, useState, useEffect } from "react";
import "../css/Verifyuser.css";

import UserContext from "../context/UserContext";
import ToastContext from "../context/ToastContext";
import Spinner from "../components/Spinner";

const Verifyuser = () => {
  const { toast } = useContext(ToastContext);
  const { userDetails, loader, verifyUser, resendOtp } =
    useContext(UserContext);

  const [credentials, setCredentials] = useState({
    userId: userDetails.userId,
    otp: "",
  });

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);

  //set timer to enable resend password
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

  //handles input value change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...credentials, [name]: value });
  };

  //handles input  value submit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!credentials.userId || !credentials.otp) {
      toast.error("Please enter all the required fields");
      return;
    }
    verifyUser(credentials);
  };

  //resend otp and reset timer
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
          <form onSubmit={handleSubmit} autoComplete="none">
            <div className="verify-container">
              <h1 className="verify-heading">Verify Otp</h1>
              <small>Enter OTP sent to your {userDetails.email} </small>
              <input
                type="number"
                placeholder="Enter OTP"
                name="otp"
                className="otpinput"
                min="1000"
                max="9999"
                value={credentials.otp}
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
              <input type="submit" value="VERIFY" className="button-54" />
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Verifyuser;
