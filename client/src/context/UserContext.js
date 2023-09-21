import { createContext, useContext, useEffect, useState } from "react";
import ToastContext from "./ToastContext";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { toast } = useContext(ToastContext);

  //state to store user data
  const [user, setUser] = useState(null);

  //state to store admin data
  const [admin, setAdmin] = useState(null);

  //state to store loader must be shown or not (true/false)
  const [loader, setLoader] = useState(false);

  //state to store userId and user email temporarily
  const [userDetails, setUserDetails] = useState({
    userId: "",
    email: "",
  });

  useEffect(() => {
    checkUserLogggedIn();
  }, []);

  //register request
  const registerUser = async (userData) => {
    try {
      setLoader(true);
      const res = await fetch(`http://localhost:8000/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ ...userData }),
      });

      const result = await res.json();

      if (!result.error) {
        toast.success(result.message);
        setUserDetails({
          userId: result.data.userId,
          email: result.data.email,
        });
        setLoader(false);
        navigate("/verifyuser", { replace: true });
      } else {
        toast.error(result.error);
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  //verify otp request
  const verifyUser = async (userData) => {
    try {
      setLoader(true);
      const res = await fetch("http://localhost:8000/api/user/verifyotp", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();

      if (!result.error) {
        toast.success(result.message);
        setUserDetails({ userId: "", email: "" });
        setLoader(false);
        navigate("/login", { replace: true });
      } else {
        toast.error(result.error);
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  //resend otp request
  const resendOtp = async (userData) => {
    try {
      setLoader(true);
      const res = await fetch(
        "http://localhost:8000/api/user/resendverifyotp",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({ ...userData }),
        }
      );
      const result = await res.json();

      if (!result.error) {
        toast.success(result.message);
        setUserDetails({
          userId: result.data.userId,
          email: result.data.email,
        });
        setLoader(false);
      } else {
        toast.error(result.error);
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  //forget password request
  const forgetPassword = async (userData) => {
    try {
      setLoader(true);
      const res = await fetch("http://localhost:8000/api/user/forgetpassword", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();

      if (!result.error) {
        toast.success(result.message);
        setUserDetails({
          userId: result.data.userId,
          email: result.data.email,
        });
        setLoader(false);
        navigate("/forgetpassword", { replace: true });
      } else {
        toast.error(result.error);
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  //verify and reset password
  const resetPassword = async (userData) => {
    try {
      setLoader(true);
      const res = await fetch("http://localhost:8000/api/user/resetpassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();

      if (!result.error) {
        toast.success(result.message);
        setLoader(false);
        navigate("/login", { replace: true });
      } else {
        toast.error(result.error);
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  //login request
  const loginUser = async (userData) => {
    try {
      setLoader(true);
      const res = await fetch("http://localhost:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();

      if (!result.error) {
        localStorage.setItem("token", result.token);
        if (result.user.email === "library5917@gmail.com") {
          setAdmin(result.user);
          toast.success(`Successfully logged in Admin`);
          setLoader(false);
          navigate("/adminhome", { replace: true });
        } else {
          setUser(result.user);
          toast.success(`Successfully logged in ${result.user.name}`);
          setLoader(false);
          navigate("/userhome", { replace: true });
        }
      } else {
        toast.error(result.error);
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  //check if the user logged in
  const checkUserLogggedIn = async () => {
    try {
      setLoader(true);
      const res = await fetch("http://localhost:8000/api/user/currentuser", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();

      if (!result.error) {
        //if input credentials matches admin credentials then store admin data in admin state else store in user state
        if (result.currentuser.email === "library5917@gmail.com") {
          if (
            location.pathname === "/login" ||
            location.pathname === "/register"
          ) {
            setTimeout(() => {
              navigate("/adminhome", { replace: true });
            }, 100);
          } else {
            navigate(location.pathname ? location.pathname : "/adminhome");
          }
          setAdmin(result.currentuser);
          setLoader(false);
        } else {
          if (
            location.pathname === "/login" ||
            location.pathname === "/register"
          ) {
            setTimeout(() => {
              navigate("/userhome", { replace: true });
            }, 100);
          } else {
            navigate(location.pathname ? location.pathname : "/userhome");
          }
          setUser(result.currentuser);
          setLoader(false);
        }
      } else {
        navigate("/login", { replace: true });
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        registerUser,
        verifyUser,
        resendOtp,
        loginUser,
        forgetPassword,
        resetPassword,
        user,
        setUser,
        userDetails,
        setUserDetails,
        admin,
        setAdmin,
        loader,
        setLoader,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
