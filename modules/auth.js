const validateToken = require("./token").validateToken;

const authenticator = async (req, res, next) => {
  if (!req.headers.authtoken || !req.headers.userinfo) {
    return res.status(403).json("invalid token").end();
  }

  try {
    const userInfo = JSON.parse(req.headers.userinfo);

    const token = req.headers.authtoken;

    const resp = validateToken(token, userInfo);

    if (!resp) {
      return res.status(403).json("invalid token").end();
    } else {
      next();
    }

  } catch (err) {
    res.status(403).json("invalid user").end();
  }

}


module.exports = authenticator;