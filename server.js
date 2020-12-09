const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));

/*
server.use(bodyParser.urlencoded({ limit: "25mb", extended: true, parameterLimit: 1000000 }));
server.use(bodyParser.json({ limit: "25mb" }));
*/

// ----------------------------- globale variabler ----------------------- //

const maxCharLength = 20;
const minCharLength = 3;

//

// -------------------------------  ask for access / new user ---------------------- //

server.post("/access", async function (req, res) {
     //const username = req.body.username;
     //const password = req.body.password;

     console.log(req.body)

     /*if (username.length >= minCharLength && password.length >= minCharLength) {

          if (username.length > maxCharLength || password.length > maxCharLength) {
               res.status(403).json(`Username or password is exceeding ${maxCharLength} characters!`).end();
          } else {

               //const newUser = new user(username, password);
               //const resp = await newUser.create();
               let resp = 0;

               if (resp === null) {
                    res.status(401).json("Username is taken!").end();
               } else {
                    res.status(200).json("Account created!").end();
               }
          }
     } else {
          res.status(403).json(`Username or password is too short, min length is ${minCharLength} characters!`).end();
     }*/

     res.status(200).end();
});

//



// ------------------------------- allows the server to run on localhost  ------------------------------- //

server.listen(server.get('port'), function () {
     console.log('server running', server.get('port'));
})