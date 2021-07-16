const bcrypt = require("bcryptjs");

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt
      .genSalt(10)
      .then((salt) => {
        bcrypt
          .hash(password, salt)
          .then((hashedPassword) => {
            resolve(hashedPassword);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = hashPassword;
