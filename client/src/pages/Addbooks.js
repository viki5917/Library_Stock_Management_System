import React, { useContext, useState } from "react";

import "../css/Addbooks.css";
import Spinner from "../components/Spinner";
import UserContext from "../context/UserContext";
import ToastContext from "../context/ToastContext";

const Addbooks = () => {
  const { loader, setLoader, admin } = useContext(UserContext);
  const { toast } = useContext(ToastContext);

  const [credentials, setCredentials] = useState({
    title: "",
    author: "",
    isbncode: "",
    genre: "",
    language: "",
    description: "",
    bookcount: "",
    photo: null,
  });

  //input text value change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...credentials, [name]: value });
  };

  //input file change
  const handleInputFile = (event) => {
    setCredentials({ ...credentials, photo: event.target.files[0] });
  };

  //form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData();
    form.append("title", credentials.title);
    form.append("author", credentials.author);
    form.append("isbncode", credentials.isbncode);
    form.append("genre", credentials.genre);
    form.append("language", credentials.language);
    form.append("description", credentials.description);
    form.append("bookcount", credentials.bookcount);
    form.append("photo", credentials.photo);

    try {
      setLoader(true);
      const res = await fetch(`http://localhost:8000/api/admin/addbook`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });
      const result = await res.json();
      if (!result.error) {
        toast.success(`Book ${credentials.title} added successfully`);
        setCredentials({
          title: "",
          author: "",
          isbncode: "",
          genre: "",
          language: "",
          description: "",
          bookcount: "",
          photo: null,
        });
        setLoader(false);
      } else {
        toast.error(result.error);
        setLoader(false);
      }
    } catch (err) {
      toast.error(err.message);
      setLoader(false);
    }
  };

  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          {admin ? (
            <form onSubmit={handleSubmit} autoComplete="none">
              <div className="addbooks-container">
                <h1 className="addbooks-heading">ADD BOOK</h1>
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  className="input"
                  value={credentials.title}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Author"
                  name="author"
                  className="input"
                  value={credentials.author}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  placeholder="ISBN Code"
                  name="isbncode"
                  className="input"
                  value={credentials.isbncode}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Genre"
                  name="genre"
                  className="input"
                  value={credentials.genre}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  placeholder="Language"
                  name="language"
                  className="input"
                  value={credentials.language}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  placeholder="Description"
                  name="description"
                  className="input"
                  rows="4"
                  cols="50"
                  style={{ resize: "none" }}
                  value={credentials.description}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  placeholder="Book Count"
                  name="bookcount"
                  min="0"
                  className="input"
                  value={credentials.bookcount}
                  onChange={handleInputChange}
                  required
                />
                <div className="choosefile">
                  <input
                    type="file"
                    name="photo"
                    className="photo"
                    accept="image/jpeg, image/jpg, image/png"
                    onChange={handleInputFile}
                    required
                  />
                </div>
                <input type="submit" value="ADDBOOK" className="button-54" />
              </div>
            </form>
          ) : (
            <>
              <h1>404 Page Not Found !</h1>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Addbooks;
