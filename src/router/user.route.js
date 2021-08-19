const express = require("express");
const router = express.Router();
const {
  LogIn,
  SignUp,
  deleteUser,
  addUser,
} = require("../controller/user.controller");
const { contactUs } = require("../controller/contactUs");

router.post("/signup", SignUp);
router.post("/login", LogIn);
router.post("/addUser", addUser);
router.delete("/deleteUser", deleteUser);
router.post("/contactUs", contactUs);
module.exports = router;

//https://logger2022.herokuapp.com/
