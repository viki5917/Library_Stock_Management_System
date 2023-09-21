const express = require("express");
const router = express.Router();

//validate user token middleware
const validateToken = require("../middleware/validateTokenHandler");
//validate photo and upload middleware
const uploadMiddleware = require("../middleware/multerMiddleware");

const {
  addNewBook,
  getAllBooks,
  updateBook,
  deleteBook,
  getBook,
  getAllUsersDetails,
} = require("../controllers/booksController");

//validate user token for all the routers
router.use(validateToken);

//to add new book to the database
router.post("/addbook", uploadMiddleware.single("photo"), addNewBook);

// to get all books
router.get("/allbooks", getAllBooks);

//to update book details
router.put("/updatebook", uploadMiddleware.single("photo"), updateBook);

//to delete a book
router.delete("/deletebook/:id", deleteBook);

//to get a single book
router.get("/book/:id", getBook);

//to get all user details
router.get("/allusers", getAllUsersDetails);

module.exports = router;
