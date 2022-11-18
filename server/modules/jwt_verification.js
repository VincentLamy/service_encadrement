const jwt = require('jsonwebtoken');
require('dotenv').config();

function jwtVerification(token) {
    return verification = jwt.verify(token, process.env.JWT_KEY, (err) => {
    if (err) {
      return false;
    }
    return true;
  });
}

module.exports = jwtVerification;