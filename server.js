const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));


//
const user = require("./modules/user");
const validate = require("./modules/user").validate;

//

server.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit: 1000000 }));
server.use(bodyParser.json({ limit: "5mb" }));


// ----------------------------- globale variabler ----------------------- //

const maxCharLength = 20;
const minCharLength = 3;

//

// -------------------------------  ask for access / new user ---------------------- //

server.post("/access", async function (req, res) {
     const username = req.body.username;
     const password = req.body.password;
     const displayname = req.body.displayname;

     if (username && password && displayname) {

          const newUser = new user(username, password, displayname);
          const resp = await newUser.addToPendingList();

          if (resp === null) {
               res.status(401).json("Brukernavnet er opptatt!").end();
          } else {
               res.status(200).json("Du har nå bedt om tilgang!").end();
          }

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//



// -------------------------------  login / autenticate user ---------------------- //

server.post("/autenticate", async function (req, res) {

     const credentials = req.body.authorization.split(' ')[1];
     const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

     if (username && password) {

          /*const requestUser = new user(username, password);
          const isValid = await requestUser.validate();*/

          const requestUser = await validate(username, password);
          const isValid = requestUser.isValid;

          if (isValid) {
               const sessionToken = "jwt.io";//createToken(requestUser);
               res.status(200).json({ "authToken": sessionToken, "user": requestUser.userInfo }).end();
          } else {
               res.status(403).json("Brukernavn eller passord er feil!").end();
          }

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//



// ------------------------------- allows the server to run on localhost  ------------------------------- //

server.listen(server.get('port'), function () {
     console.log('server running', server.get('port'));
})