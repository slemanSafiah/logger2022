const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// routers
const userRoutes = require("./src/router/user.route");

//app
const app = express();

// initial dotenv
dotenv.config();

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// parse json request body
app.use(bodyParser.json({ limit: "50mb" }));

//************************** Access Origin ****************************************/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

// enable cors
app.use(cors());
app.options("*", cors());

//************************* routeing  ********************************************/

app.use("/user", userRoutes);

//************************ Connect To DB *****************************************/

mongoose.connect(process.env.MongoDB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  socketTimeoutMS: 36000,
  connectTimeoutMS: 36000,
});
mongoose.connection.on("open", () => {
  console.log("Connect to DB ...");
});
mongoose.connection.on("error", (err) => {
  console.log("Error in DB ...\n", err);
});

//************************ Create SERVER *****************************************/
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
