const User = require("../model/user.model");
const httpStatus = require("http-status");
const { v4: uuidv4 } = require("uuid");
const hashPassword = require("../util/hash.helper");
const bcrypt = require("bcryptjs");
const axios = require("axios");

exports.SignUp = (req, res) => {
  req.body.userId = uuidv4();
  hashPassword(req.body.password).then((password) => {
    req.body.password = password;
    User.create(req.body)
      .then(async (createdUser) => {
        let url = `https://projectfifthyear.herokuapp.com/Users?
            ApiKey=${process.env.APIKEY}&
            ApiSecret=${process.env.APISECRET}&
            userId=${createdUser.userId}`;

        //const token = await axios.post(url, req.body);

        return res.status(httpStatus.CREATED).json({
          //token: token,
          data: createdUser,
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
  User.findOne({ email: req.body.email })
    .then(async (user) => {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const url = `https://projectfifthyear.herokuapp.com/Users?ApiKey=${process.env.APIKEY}&ApiSecret=${process.env.APISECRET}&userId=${user.userId}`;

        const token = await axios({
          method: "post",
          url: url,
        });

        user = user.toObject();
        delete user.password;

        return res.status(httpStatus.OK).json({
          token: token.data,
          data: user,
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
