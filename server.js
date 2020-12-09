const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));

//

const auth = require("./modules/auth");

const user = require("./modules/user");
const validateUser = require("./modules/user").validateUser;
const getListOfUsers = require("./modules/user").getListOfUsers;

const createToken = require("./modules/token").createToken;
const validateToken = require("./modules/token").validateToken;


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

          const requestUser = await validateUser(username, password);
          const isValid = requestUser.isValid;

          if (isValid) {
               const sessionToken = createToken(requestUser.userInfo);
               res.status(200).json({ "authToken": sessionToken, "user": requestUser.userInfo }).end();
          } else {
               res.status(403).json("Brukernavn eller passord er feil!").end();
          }

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//


// -------------------------------  get list of users ---------------------- //

server.post("/list/users", auth, async (req, res) => {

     const listOfUsers = await getListOfUsers();

     if (listOfUsers) {

          res.status(200).json(listOfUsers).end();

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//

// test

server.post("/validate", auth, async (req, res) => {

     const currentUser = JSON.parse(req.body.userInfo);

     console.log("valid, current user: " + currentUser.username); // test / grei log i terminal

});

//

// redirects user if url does not exist

server.get("*", function (req, res) {
     res.redirect("/");
});

//



// ------------------------------- allows the server to run on localhost  ------------------------------- //

server.listen(server.get('port'), function () {
     console.log('server running', server.get('port'));
})