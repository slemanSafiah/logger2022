const User = require("../model/user.model");
const httpStatus = require("http-status");
const { v4: uuidv4 } = require("uuid");
const hashPassword = require("../util/hash.helper");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const mongoose = require("mongoose");

exports.SignUp = (req, res) => {
  req.body.userId = uuidv4();
  hashPassword(req.body.password).then((password) => {
    req.body.password = password;
    User.create(req.body)
      .then(async (createdUser) => {
        let url = `https://projectfifthyear.herokuapp.com/Users/signup?ApiKey=${process.env.APIKEY}&ApiSecret=${process.env.APISECRET}&userId=${createdUser.userId}`;

        const token = await axios.post(url, req.body);
        return res.status(httpStatus.CREATED).json({
          token: token.data,
          user: createdUser,
          team: req.body.teamName,
          project: req.body.projectName,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          err,
        });
      });
  });
};

exports.LogIn = (req, res) => {
  User.findOne(
    req.body.email ? { email: req.body.email } : { userName: req.body.userName }
  )
    .then(async (user) => {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const url = `https://projectfifthyear.herokuapp.com/Users/signin?ApiKey=${process.env.APIKEY}&ApiSecret=${process.env.APISECRET}&userId=${user.userId}`;

        const token = await axios({
          method: "post",
          url: url,
        });

        user = user.toObject();
        delete user.password;

        return res.status(httpStatus.OK).json({
          token: token.data,
          user: user,
        });
      } else {
        return res.status(httpStatus.UNAUTHORIZED).json({
          err: "unauthorized",
        });
      }
    })
    .catch((err) => {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        err,
      });
    });
};
exports.addUser = (req, res) => {
  req.body.userId = uuidv4();
  hashPassword(req.body.password).then((password) => {
    req.body.password = password;
    User.create(req.body)
      .then(async (createdUser) => {
        let url = `https://projectfifthyear.herokuapp.com/Users?sessionId=${req.body.sessionId}&Id=${req.body.userId}&Name=${req.body.name}&UserName=${req.body.userName}&Email=${req.body.email}`;

        const token = await axios.post(url);
        return res.status(httpStatus.CREATED).json({
          user: createdUser,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          err,
        });
      });
  });
};

exports.deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  await session.withTransaction(async (session) => {
    const url = `https://projectfifthyear.herokuapp.com/Users?sessionId=${req.body.sessionId}&userId=${req.body.teamMemberId}`;
    const result = await axios.delete(url);
    await User.deleteOne(
      { userId: req.body.teamMemberId },
      { session: session }
    );
    if (!result)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ delete: "failed", result: result });
    return res.status(httpStatus.OK).json({ delete: "Done!", result: result });
  });
};
