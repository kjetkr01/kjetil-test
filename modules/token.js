const jwt = require('jsonwebtoken');
const tokenSecret = process.env.tokenSecret || require("../localenv").tokenSecret;
const validateUserInfoFromToken = require('./user').validateUserInfoFromToken;

// ----------- Creates the token --------------- //

function createToken(userInfo) {

    // evt endre til lenger
    const token = jwt.sign(userInfo, tokenSecret, { expiresIn: '1d' });

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

// ----------- refreshes / creates new token --------------- //

async function refreshToken(token, userInfo) {

    let isTokenValid = false;
    let newToken = "";

    const tokenInfo = jwt.decode(token, tokenSecret);
    if (tokenInfo.id === userInfo.id && tokenInfo.username === userInfo.username && tokenInfo.displayname === userInfo.displayname && tokenInfo.password && tokenInfo.iat && tokenInfo.exp) {

        if (Date.now() >= tokenInfo.exp * 1000) {
            console.log("expired, refresh");
            const resp = await validateUserInfoFromToken(tokenInfo.username, tokenInfo.password);

            if (resp !== false) {
                const updatedToken = createToken(resp);
                newToken = updatedToken;
                isTokenValid = true;
            }

        }

        return { "isTokenValid": isTokenValid, "authToken": newToken };

    }
}

module.exports.createToken = createToken;
module.exports.validateToken = validateToken;
module.exports.refreshToken = refreshToken;