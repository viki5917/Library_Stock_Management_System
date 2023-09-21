import React, { useContext, useState, useEffect } from "react";

import "../css/Adminhome.css";
import Spinner from "../components/Spinner";
import UserContext from "../context/UserContext";
import ToastContext from "../context/ToastContext";
import BackToTop from "./BackToTop";

const Adminhome = () => {
  const { loader, setLoader, user } = useContext(UserContext);
  const { toast } = useContext(ToastContext);
  const [allBooks, setAllBooks] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});

  //get all the books from the data while loading
  useEffect(() => {
    (async () => {
      setLoader(true);
      try {
        const res = await fetch(`http://localhost:8000/api/user/allbooks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setAllBooks(result.myBooks);
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
          {user ? (
            <div className="booksContainer">
              <div className="search">
                <input
                  type="search"
                  name="search"
                  placeholder="Search Book"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="books">
                {allBooks
                  .filter((item) => {
                    return searchInput.toLowerCase() === ""
                      ? item
                      : item.title
                          .toLowerCase()
                          .includes(searchInput.toLowerCase());
                  })
                  .map((book) => (
                    <div
                      className="stack"
                      key={book._id}
                      onClick={() => {
                        setModalData({});
                        setModalData(book);
                        setShowModal(true);
                      }}
                    >
                      <div className="card">
                        <div className="image">
                          <img
                            src={`http://localhost:8000/uploads/${book.photo}`}
                          />
                        </div>
                        <h3>{book.title}</h3>
                      </div>
                    </div>
                  ))}
              </div>
              <BackToTop />
            </div>
          ) : (
            <h1>404 Page Not Found !</h1>
          )}
        </>
      )}

      {/* Popup modal for showing book details */}

      {showModal && (
        <div className="modalBackground">
          <div className="modalContainer">
            <div className="titleCloseBtn">
              <button onClick={() => setShowModal(false)}>X</button>
            </div>
            <div className="modalImage">
              <img
                src={`http://localhost:8000/uploads/${modalData.photo}`}
                alt={modalData.title}
              />
            </div>
            <div className="modalTitle">
              <h2>{modalData.title}</h2>
            </div>

            <div className="modalBody">
              <p>
                <strong>Author : </strong>
                {modalData.author}
              </p>
              <p>
                <strong>Genre : </strong>
                {modalData.genre}
              </p>
              <p>
                <strong>Language : </strong>
                {modalData.language}
              </p>
              <p>
                <strong>No of books : </strong>
                {modalData.bookcount}
              </p>
              <p>
                <strong>Summary : </strong>
                {modalData.description}
              </p>
              <p>
                {modalData.availability ? (
                  <strong style={{ color: "green" }}>Available </strong>
                ) : (
                  <strong style={{ color: "red" }}>Not Available</strong>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Adminhome;
