import React, { useContext, useEffect, useState } from "react";

import "../css/Allusers.css";
import UserContext from "../context/UserContext";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import BackToTop from "./BackToTop";

const Allusers = () => {
  const { loader, setLoader, admin } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);

  //to get all the user details from database while loading the page
  useEffect(() => {
    (async () => {
      setLoader(true);
      try {
        const res = await fetch(`http://localhost:8000/api/admin/allusers`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setAllUsers(result.allusers);
          setLoader(false);
        } else {
          toast.error(result.error);
          setLoader(false);
        }
      } catch (err) {
        toast.error(err.message);
        setLoader(false);
      }
    })();
  }, []);

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          {admin ? (
            <>
              {allUsers.length > 0 ? (
                <>
                  <table>
                    <caption>ALL USERS</caption>
                  </table>
                  <h3 style={{ marginBottom: "1rem" }}>
                    Total Number of Users: {allUsers.length}
                  </h3>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user) => (
                        <tr key={user._id}>
                          <td data-label="Name">{user.name}</td>
                          <td data-label="Email">{user.email}</td>
                          <td data-label="Address">{user.address}</td>
                          <td data-label="Phone">{user.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <BackToTop />
                </>
              ) : (
                <h1>No Users found !</h1>
              )}
            </>
          ) : (
            <>
              <h1>404 Not Found !</h1>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Allusers;
