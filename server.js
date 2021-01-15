const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));

// user api calls

const auth = require("./modules/auth");

const user = require("./modules/user");
const validateUser = require("./modules/user").validateUser;
const getListOfUsers = require("./modules/user").getListOfUsers;
const getListOfLeaderboardsUsers = require("./modules/user").getListOfLeaderboardsUsers;
const getListOfPendingUsers = require("./modules/user").getListOfPendingUsers;
const acceptOrDenyUser = require("./modules/user").acceptOrDenyUser;
const getWorkoutSplit = require("./modules/user").getWorkoutSplit;
const getUserDetails = require("./modules/user").getUserDetails;
const getUserSettingsAndInfo = require("./modules/user").getUserSettingsAndInfo;
const updateUserSetting = require("./modules/user").updateUserSetting;
const getListOfAllUsersWorkoutToday = require("./modules/user").getListOfAllUsersWorkoutToday;

const createToken = require("./modules/token").createToken;

// api only

const getWorkoutPlanAPI = require("./modules/API").getWorkoutPlanAPI;

//

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
               const userInfo = {
                    "id": requestUser.userInfo.id,
                    "username": requestUser.userInfo.username,
                    "displayname": requestUser.userInfo.displayname,
                    "showGymCloseTime": requestUser.userInfo.settings.showGymCloseTime.value,
                    "preferredColorTheme": requestUser.userInfo.settings.preferredColorTheme.value,
               }
               const sessionToken = createToken(requestUser.userInfo);
               res.status(200).json({ "authToken": sessionToken, "user": userInfo }).end();
          } else {
               res.status(403).json("Brukernavn eller passord er feil!").end();
          }

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//


// -------------------------------  get list of users ---------------------- //

server.post("/users/list/all", auth, async (req, res) => {

     const listOfUsers = await getListOfUsers();

     if (listOfUsers) {

          res.status(200).json(listOfUsers).end();

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//

// -------------------------------  get list of users on leaderboard ---------------------- //

server.post("/users/list/all/leaderboards", auth, async (req, res) => {

     let numbersOnly = false;

     if (req.body.numbersOnly && req.body.numbersOnly === true) {
          numbersOnly = true;
     }

     const listOfLeaderboardsUsers = await getListOfLeaderboardsUsers(numbersOnly);

     if (listOfLeaderboardsUsers) {

          res.status(200).json(listOfLeaderboardsUsers).end();

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//


// -------------------------------  get list of pending users (requests) ---------------------- //

server.post("/users/list/pending", auth, async (req, res) => {

     //kun for admins...

     let onlyNumbers = false;

     if (req.body.onlyNumbers) {
          onlyNumbers = true;
     }

     let username = req.body.userInfo;
     username = JSON.parse(username);
     username = username.username;

     const listOfPendingUsers = await getListOfPendingUsers(username, onlyNumbers);

     // list of pending status ??

     if (listOfPendingUsers) {

          res.status(200).json(listOfPendingUsers).end();

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//

// -------------------------------  accept or deny pending user ---------------------- //

server.post("/users/pending/:user/:acceptOrDeny", auth, async (req, res) => {

     //kun for admins...

     let username = req.body.userInfo;
     username = JSON.parse(username);
     username = username.username;

     const pendingUser = req.body.pendingUser;
     const acceptOrDeny = req.body.acceptOrDeny;

     if (username && pendingUser) {

          const resp = await acceptOrDenyUser(username, pendingUser, acceptOrDeny);

          if (resp === true) {
               res.status(200).json("Ok").end();
          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// -------------------------------  whatToTrainToday (user) ---------------------- //

server.post("/user/whatToTrainToday", auth, async (req, res) => {

     let username = req.body.userInfo;
     username = JSON.parse(username);
     username = username.username;

     if (username) {

          const resp = await getWorkoutSplit(username);

          if (resp.status === true) {
               res.status(200).json(resp.program).end();
          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// -------------------------------  get user details (view userPage) ---------------------- //

server.post("/users/details/:user", auth, async (req, res) => {

     let username = req.body.userInfo;
     username = JSON.parse(username);
     username = username.username;

     const viewingUser = req.body.viewingUser

     if (username && viewingUser) {

          const resp = await getUserDetails(viewingUser, username);

          if (resp.status === true) {
               if (resp.userDetails !== false) {
                    res.status(200).json(resp.userDetails).end();
               } else {
                    res.status(403).json(`${viewingUser} sin profil er privat!`).end();
               }
          } else {
               res.status(403).json(`Brukeren finnes ikke!`).end();
          }
     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// get user settings and info

server.post("/user/details/settingsInfo", auth, async (req, res) => {

     const currentUser = JSON.parse(req.body.userInfo);

     if (currentUser.username) {

          const resp = await getUserSettingsAndInfo(currentUser.username);

          const userInfo = {
               "id": resp.userDetails.id,
               "username": resp.userDetails.username,
               "displayname": resp.userDetails.displayname,
               "showGymCloseTime": resp.userDetails.settings.showGymCloseTime.value,
               "preferredColorTheme": resp.userDetails.settings.preferredColorTheme.value,
          }

          if (resp.status === true) {
               res.status(200).json({ "settings": resp.userDetails.settings, "userInfo": userInfo }).end();
          } else {
               res.status(403).json("error, try again").end();
          }

     } else {
          res.status(403).json("invalid user").end();
     }

});

//

// update user settings

server.post("/user/update/settings/:setting", auth, async (req, res) => {

     const currentUser = JSON.parse(req.body.userInfo);
     const setting = req.body.updateSetting;
     const value = req.body.value;

     //accepter bare "godkjente" settings

     if (currentUser.username && setting && value === true || value === false || value === "auto" || value === "light" || value === "dark") {

          if (setting === "publicProfile" || setting === "showGymCloseTime" || setting === "preferredColorTheme" || setting === "displayLeaderboards" || setting === "displayWorkoutList") {

               const resp = await updateUserSetting(currentUser.username, setting, value);

               if (resp === true) {
                    res.status(200).json(`updated setting`).end();
               } else {
                    res.status(403).json("error, try again").end();
               }

          } else {
               res.status(403).json("invalid setting").end();
          }

     } else {
          res.status(403).json("invalid user").end();
     }

});

//

// get list of all people who are working out today (only public users)

server.post("/whoIsWorkingOutToday", auth, async (req, res) => {

     const resp = await getListOfAllUsersWorkoutToday();

     if (resp.status === true) {
          res.status(200).json(resp.info).end();
     } else {
          res.status(403).json("error, try again").end();
     }

});

//

// test

server.post("/validate", auth, async (req, res) => {

     //const currentUser = JSON.parse(req.body.userInfo);

     //console.log("valid, current user: " + currentUser.username); // test / grei log i terminal

     res.status(200).json("Ok").end();

});

//

// get list of different api

server.get("/api", function (req, res) {
     const resp = [
          "/getWorkoutInfo/:user/:key",
          "Kommer snart:",
          "hent benk, knebøy, markløft + totalen / og / eller lifts (maks 3? / kan velge)",
          "hent mål i ulike løft (maks 3? / kan velge)",
     ];
     res.status(200).json(resp).end();
});

//

// api

server.get("/getWorkoutInfo/:user/:key", async function (req, res) {

     const url = req.url;
     const urlInfo = url.split("/");

     if (urlInfo[1] === "getWorkoutInfo" && urlInfo[2].length < maxCharLength && urlInfo[3].length < maxCharLength) {
          const user = urlInfo[2];
          const key = urlInfo[3];

          const getWorkoutPlanInfo = await getWorkoutPlanAPI(user, key);

          if (getWorkoutPlanInfo.status === true) {

               const day = new Date().getDay();
               const program = getWorkoutPlanInfo.info.trainingsplit;
               let firstName = getWorkoutPlanInfo.info.displayname
               firstName = firstName.split(" ");
               firstName = firstName[0];

               let dayTxt = "";
               let workoutTxt = "";

               switch (day) {
                    case 0:
                         dayTxt = "Søndag";
                         break;
                    case 1:
                         dayTxt = "Mandag";
                         break;
                    case 2:
                         dayTxt = "Tirsdag";
                         break;
                    case 3:
                         dayTxt = "Onsdag";
                         break;
                    case 4:
                         dayTxt = "Torsdag";
                         break;
                    case 5:
                         dayTxt = "Fredag";
                         break;
                    case 6:
                         dayTxt = "Lørdag";
                         break;
               }

               if (getWorkoutPlanInfo.isOwner === true) {

                    if (program[dayTxt].length > 0 && program[dayTxt] !== "Fri") {
                         workoutTxt = `Skal du trene ${program[dayTxt]}`;
                    } else {
                         workoutTxt = `Skal du ikke trene`;
                    }

               } else {

                    if (program[dayTxt].length > 0 && program[dayTxt] !== "Fri") {
                         workoutTxt = `Trener ${firstName} ${program[dayTxt]}`;
                    } else {
                         workoutTxt = `Trener ikke ${firstName}`;
                    }
               }

               const resp = {
                    "currentDay": dayTxt.toLocaleLowerCase(),
                    "todaysWorkout": workoutTxt
               }

               res.status(200).json(resp).end();

          } else {
               res.status(403).json(`ingen tilgang`).end();
          }

     } else {
          res.status(403).json(`ingen tilgang`).end();
     }
})


//



// ------------------------------- allows the server to run on localhost  ------------------------------- //

server.listen(server.get('port'), function () {
     console.log('server running', server.get('port'));
})