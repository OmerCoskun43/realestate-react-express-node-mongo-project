const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const listingRouter = require("./routes/listing.route");
const cookieParser = require("cookie-parser");
const path = require("path");

//! Convert JSON()
const app = express();
app.use(express.json());
app.use(cookieParser());

//! Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

//!Canlıya Alma

// const __dirname = path.resolve();

//! App Listen
app.listen(3000, () => {
  console.log("Server is running on port 3000!!! ");
});

//! Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// app.use(express.static(path.join(__dirname, "/frontEnd/dist")));

// app.use(express.static("/frontEnd"));

// app.get("*", (req, res) => {
//   res.sendFile(path.join("/frontEnd", "index.html"));
// });

app.use(express.static("frontEnd"));

app.get("*", (req, res) => {
  res.sendFile(path.join("frontEnd", "index.html"));
});

//! Error middleware

app.use((err, req, res, next) => {
  console.log(err);
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
