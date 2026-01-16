


require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const route = require("./src/routes/authRoutes");
const cors = require("cors");
const aiRoutes = require("./src/routes/aiRoutes");

const app = express();


app.use(cors());
app.use(express.json()); // Middleware
app.use("/api", route); // Middleware
app.use("/api/news", require("./src/routes/newsRoutes"));
app.use("/api/ai", aiRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/news-website")
  .then(() => console.log("MongoDb is Connected"))
  .catch((err) => console.log("DB Connection Failed", err));

// Server Creation
app.get("/", (req, res) => {
  res.send("Hello From Express Js");
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is Running At Port ${PORT}`);
  }
});


