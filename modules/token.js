const jwt = require('jsonwebtoken');
const tokenSecret = process.env.tokenSecret || require("../localenv").tokenSecret;

// ----------- Creates the token --------------- //

function createToken(userInfo) {

    const token = jwt.sign(userInfo, tokenSecret, {expiresIn: '15s'});

    return token;

}

//  --------------------------- Checks if token is valid  ------------------------------- //

function validateToken(token, userInfo) {

    let isTokenValid = false;

    jwt.verify(token, tokenSecret, (err) => {
        if (err) return isTokenValid;
        const tokenInfo = jwt.verify(token, tokenSecret);
        if(tokenInfo.id === userInfo.id && tokenInfo.username === userInfo.username && tokenInfo.displayname === userInfo.displayname){
            isTokenValid = true;
        }
    });

    return isTokenValid;

}

module.exports.createToken = createToken;
module.exports.validateToken = validateToken;