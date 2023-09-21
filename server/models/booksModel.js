const mongoose = require("mongoose");
const Joi = require("joi");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    author: {
      type: String,
      required: [true, "author name is required"],
    },
    isbncode: {
      type: String,
      required: [true, "ISBN Code is required"],
    },
    genre: {
      type: String,
      require: [true, "Genre is required"],
    },
    language: {
      type: String,
      require: [true, "Language is required"],
    },
    description: {
      type: String,
      require: [true, "Description is required"],
    },
    bookcount: {
      type: Number,
      require: [true, "Number of books count is required"],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
      require: [true, "Book Cover photo is required"],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//validate all the input fields by using Joi
const validateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(4).max(50).required(),
    author: Joi.string().min(4).max(100).required(),
    isbncode: Joi.string().min(10).max(14).required(),
    genre: Joi.string().min(4).max(20).required(),
    language: Joi.string().min(3).max(20).required(),
    description: Joi.string().min(10).max(400).required(),
    bookcount: Joi.number().min(0).max(100).required(),
  });
  return schema.validate(data);
};

const Books = new mongoose.model("Books", bookSchema);

module.exports = { validateBook, Books };
