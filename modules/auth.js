const validateToken = require("./token").validateToken;

const authenticator = async (req, res, next) => {
  if (!req.body.authToken || !req.body.userInfo) {
    return res.status(403).json("invalid token").end();
  }

  try {
    const userInfo = JSON.parse(req.body.userInfo);

    const token = req.body.authToken;

    const resp = validateToken(token, userInfo);

    console.log(`valid token: ${resp}`); // test

    if (!resp) {
      return res.status(403).json("invalid token").end();
    }
    next();

  } catch (err) {
    res.status(403).json("invalid user").end();
  }

}


module.exports = authenticator