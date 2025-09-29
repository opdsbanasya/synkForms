const express = require("express");
require("dotenv").config();
const { connectToDatabase } = require("./config/dbConnection");
const authRouter = require("./routes/authRouter");
const formRouter = require("./routes/formRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", authRouter);
app.use("/", formRouter);

connectToDatabase()
  .then(() => {
    console.log("Connection established 🟢 ");
    app.listen(port, () => {
      console.log(`Server is running on port ${port} 👍`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
