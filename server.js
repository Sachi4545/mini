const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();


// MIDDLEWARE

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));


// DATABASE

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// TEST ROUTE

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.get("/test", (req, res) => {
  res.json({ message: "Routes working" });
});



// ROUTES

app.use("/users", require("./routes/userRoutes"));

app.use("/posts", require("./routes/postRoutes"));



// SERVER

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});