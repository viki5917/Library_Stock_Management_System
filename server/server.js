const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/dbConnection");

const app = express();

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

//routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/booksRoutes"));
//route to get image
app.use("/uploads", express.static("uploads"));

//server configurations
const PORT = process.env.PORT || 8001;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
