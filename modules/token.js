const jwt = require('jsonwebtoken');
const tokenSecret = process.env.tokenSecret || require("../localenv").tokenSecret;

// ----------- Creates the token --------------- //

function createToken(userInfo) {

    // evt endre til lenger
    const token = jwt.sign(userInfo, tokenSecret, { expiresIn: '30d' });

    return token;

}

//  --------------------------- Checks if token is valid  ------------------------------- //

function validateToken(token, userInfo) {

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
        if (tokenInfo.id === userInfo.id && tokenInfo.username === userInfo.username && tokenInfo.displayname === userInfo.displayname && tokenInfo.password && tokenInfo.iat && tokenInfo.exp) {
            isTokenValid = true;
        }
    }

    return isTokenValid;

}

module.exports.createToken = createToken;
module.exports.validateToken = validateToken;