const jwt = require('jsonwebtoken');

function jwtVerification(token) {
    return verification = jwt.verify(token, 'key_se', (err) => {
    if (err) {
      return false;
    }
    return true;
  });
}

module.exports = jwtVerification;