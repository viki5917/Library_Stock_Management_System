//this context is for popup notification

import { createContext } from "react";
import "../css/Toast.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastContainer autoClose={2000} />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
