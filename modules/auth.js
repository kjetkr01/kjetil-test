const validateToken = require("./token").validateToken;

const authenticator = async (req, res, next) => {
  if (!req.headers.authtoken || !req.headers.userinfo) {
    return res.status(403).json("invalid token").end();
  }

  try {
    const userInfo = JSON.parse(req.headers.userinfo);

    const token = req.headers.authtoken;

    const resp = validateToken(token, userInfo);

    //console.log(`valid token: ${resp}`); // test / grei log i terminal

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