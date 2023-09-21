import React, { useContext, useState, useEffect } from "react";

import "../css/Addbooks.css";
import Spinner from "../components/Spinner";
import UserContext from "../context/UserContext";
import ToastContext from "../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";

const Editbook = () => {
  const { loader, setLoader, admin } = useContext(UserContext);
  const { toast } = useContext(ToastContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    id: "",
    title: "",
    author: "",
    isbncode: "",
    genre: "",
    language: "",
    description: "",
    bookcount: "",
    photo: null,
  });

  //to get the single book data using its _id while loading the page
  useEffect(() => {
    (async () => {
      setLoader(true);
      try {
        const res = await fetch(`http://localhost:8000/api/admin/book/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setCredentials({
            id: result._id,
            title: result.title,
            author: result.author,
            isbncode: result.isbncode,
            genre: result.genre,
            language: result.language,
            description: result.description,
            bookcount: result.bookcount,
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
    })();
  }, []);

  //handles Input value change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...credentials, [name]: value });
  };

  //handles input file value change
  const handleInputFile = (event) => {
    setCredentials({ ...credentials, photo: event.target.files[0] });
  };

  //handles form values while submitting
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData();
    form.append("id", credentials.id);
    form.append("title", credentials.title);
    form.append("author", credentials.author);
    form.append("isbncode", credentials.isbncode);
    form.append("genre", credentials.genre);
    form.append("language", credentials.language);
    form.append("description", credentials.description);
    form.append("bookcount", credentials.bookcount);
    //only if the new photo choosen, file appends to the form data
    if (credentials.photo) {
      form.append("photo", credentials.photo);
    }

    try {
      setLoader(true);
      const res = await fetch(`http://localhost:8000/api/admin/updatebook`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });
      const result = await res.json();
      if (!result.error) {
        toast.success(`Book ${credentials.title} updated successfully`);
        setCredentials({
          id: "",
          title: "",
          author: "",
          isbncode: "",
          genre: "",
          language: "",
          description: "",
          bookcount: "",
          photo: null,
        });
        navigate("/adminhome", { replace: true });
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
                <h1 className="addbooks-heading">EDIT BOOK</h1>
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
                  />
                </div>
                <input type="submit" value="UPDATE" className="button-54" />
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

export default Editbook;
