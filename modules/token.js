const jwt = require('jsonwebtoken');
const tokenSecret = process.env.tokenSecret || require("../localenv").tokenSecret;

// ----------- Creates the token --------------- //

function createToken(userinfo) {

    // evt endre til lenger
    const info = {
        "id": userinfo.id,
        "username": userinfo.username,
        "password": userinfo.password,
    }

    const token = jwt.sign(info, tokenSecret, { expiresIn: '30d' });

    return token;

}

//  --------------------------- Checks if token is valid  ------------------------------- //

function validateToken(token, userinfo) {

    let isTokenValid = false;

    jwt.verify(token, tokenSecret, (err) => {

        if (err) {
            return isTokenValid;
        } else {
            checkTokenInfo();
        }

    });

    function checkTokenInfo() {
        const tokenInfo = jwt.decode(token, tokenSecret);
        if (tokenInfo.id === userinfo.id && tokenInfo.username === userinfo.username && tokenInfo.password && tokenInfo.iat && tokenInfo.exp) {
            isTokenValid = true;
        }
    }

    return isTokenValid;

}

module.exports.createToken = createToken;
module.exports.validateToken = validateToken;