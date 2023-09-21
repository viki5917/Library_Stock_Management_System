import "./App.css";
import { ToastContextProvider } from "./context/ToastContext";
import { UserContextProvider } from "./context/UserContext";
import { Routes as Switch, Route } from "react-router-dom";

import Layout from "./components/Layout";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import Verifyuser from "./pages/Verifyuser";
import Forgetpassword from "./pages/Forgetpassword";
import Adminhome from "./pages/Adminhome";
import Userhome from "./pages/Userhome";
import Addbooks from "./pages/Addbooks";
import Allusers from "./pages/Allusers";
import Editbook from "./pages/Editbook";
import Notfound from "./pages/Notfound";

function App() {
  return (
    <>
      <ToastContextProvider>
        <UserContextProvider>
          <Layout>
            <Switch>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verifyuser" element={<Verifyuser />} />
              <Route path="/forgetpassword" element={<Forgetpassword />} />
              <Route path="/adminhome" element={<Adminhome />} />
              <Route path="/userhome" element={<Userhome />} />
              <Route path="/addbooks" element={<Addbooks />} />
              <Route path="/editbook/:id" element={<Editbook />} />
              <Route path="/allusers" element={<Allusers />} />
              <Route path="/*" element={<Notfound />} />
            </Switch>
          </Layout>
        </UserContextProvider>
      </ToastContextProvider>
    </>
  );
}

export default App;
