const express = require("express");
const router = express.Router();
const { LogIn, SignUp } = require("../controller/user.controller");

router.post("/signup", SignUp);
router.post("/login", LogIn);

module.exports = router;
