//mongodb books model
const { validateBook, Books } = require("../models/booksModel");

//to validate mongoose object _id
const mongoose = require("mongoose");

//mongodb user model
const User = require("../models/userModel");

//@desc Add New Book
//@route POST /api/admin/addbook
//@access private
const addNewBook = async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, author, isbncode, genre, language, description, bookcount } =
    req.body;

  try {
    const doesBookAlreadyExist = await Books.findOne({ title });

    if (doesBookAlreadyExist)
      return res.status(400).json({
        error: `Book already exist!`,
      });

    if (bookcount <= 0) {
      let newBook = new Books({
        title,
        author,
        isbncode,
        genre,
        language,
        description,
        bookcount,
        availability: false,
        postedBy: req.user._id,
      });

      if (req.file) {
        newBook.photo = req.file.filename;
      } else {
        return res
          .status(400)
          .json({ error: "Please upload the Book cover picture" });
      }
      const result = await newBook.save();

      return res.status(201).json({ ...result._doc });
    }

    let newBook = new Books({
      title,
      author,
      isbncode,
      genre,
      language,
      description,
      bookcount,
      postedBy: req.user._id,
    });
    if (req.file) {
      newBook.photo = req.file.filename;
    } else {
      return res
        .status(400)
        .json({ error: "Please upload the Book cover picture" });
    }
    const result = await newBook.save();

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Get All Books
//@route GET /api/admin/allbooks
//@access private
const getAllBooks = async (req, res) => {
  try {
    const myBooks = await Books.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );
    return res.status(200).json({ myBooks: myBooks.reverse() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Get All Books
//@route PUT /api/admin/updatebook
//@access private
const updateBook = async (req, res) => {
  const {
    id,
    title,
    author,
    isbncode,
    genre,
    language,
    description,
    bookcount,
  } = req.body;

  if (!title || !author || !isbncode || !genre || !language || !description) {
    return res.status(400).json({ error: "Enter all the required fields" });
  }

  if (!id) return res.status(400).json({ error: "no id specified" });

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter a valid id" });
  }

  try {
    const books = await Books.findOne({ _id: id });

    if (req.user._id.toString() !== books.postedBy._id.toString()) {
      return res
        .status(401)
        .json({ error: "you are not authorized to edit this book" });
    }

    // if book count is 0 then availability becomes false
    if (bookcount <= 0) {
      //if new photo selected
      if (req.file) {
        const photo = req.file.filename;
        const updatedData = {
          ...req.body,
          id: undefined,
          availability: false,
          photo,
        };
        const result = await Books.findByIdAndUpdate(id, updatedData, {
          new: true,
        });
        return res.status(200).json({ ...result._doc });
      } else {
        const updatedData = { ...req.body, id: undefined, availability: false };
        const result = await Books.findByIdAndUpdate(id, updatedData, {
          new: true,
        });
        return res.status(200).json({ ...result._doc });
      }
    }

    //by default availability if true
    if (req.file) {
      const photo = req.file.filename;
      const updatedData = {
        ...req.body,
        id: undefined,
        availability: true,
        photo,
      };
      const result = await Books.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      return res.status(200).json({ ...result._doc });
    } else {
      const updatedData = { ...req.body, id: undefined, availability: true };
      const result = await Books.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      return res.status(200).json({ ...result._doc });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Delete Book
//@route DELETE /api/admin/deletebook/:id
//@access private
const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified" });

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter a valid id" });
  }

  try {
    const book = await Books.findOne({ _id: id });

    if (!book) return res.status(400).json({ error: "no book found" });

    if (req.user._id.toString() !== book.postedBy._id.toString()) {
      return res
        .status(401)
        .json({ error: "you are not authorized to delete this book" });
    }

    const result = await Books.deleteOne({ _id: id });

    const myBooks = await Books.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res.status(200).json({ ...book._doc, myBooks: myBooks.reverse() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Single Book
//@route GET /api/admin/book/:id
//@access private
const getBook = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "no id specified" });

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "please enter a valid id" });
  }
  try {
    const book = await Books.findOne({ _id: id });
    if (!book) {
      return res.status(404).json({ error: "Book not found!" });
    }
    return res.status(200).json({ ...book._doc });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Get All User Details
//@route GET /api/admin/allusers
//@access private
const getAllUsersDetails = async (req, res) => {
  try {
    const allusers = await User.find().select("-password");
    return res.status(200).json({ allusers: allusers.reverse() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addNewBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBook,
  getAllUsersDetails,
};
