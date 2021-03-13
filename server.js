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
const getListOfLeaderboards = require("./modules/user").getListOfLeaderboards;
const getListOfUsersLeaderboard = require("./modules/user").getListOfUsersLeaderboard;
const getListOfPendingUsers = require("./modules/user").getListOfPendingUsers;
const acceptOrDenyUser = require("./modules/user").acceptOrDenyUser;
const getWorkoutSplit = require("./modules/user").getWorkoutSplit;
const getUserDetails = require("./modules/user").getUserDetails;
const getUserSettingsAndInfo = require("./modules/user").getUserSettingsAndInfo;
const updateUserSetting = require("./modules/user").updateUserSetting;
const getListOfAllUsersWorkoutToday = require("./modules/user").getListOfAllUsersWorkoutToday;

const saveLiftOrGoal = require("./modules/user").saveLiftOrGoal;
const deleteLiftOrGoal = require("./modules/user").deleteLiftOrGoal;
const updateTrainingDays = require("./modules/user").updateTrainingDays;

const allowedLifts = require("./arrayLists").allowedLifts;
const allowedGoals = require("./arrayLists").allowedGoals;
const badgeColors = require("./arrayLists").badgeColors;

const allowedTrainingDays = require("./arrayLists").allowedTrainingDays;

const createToken = require("./modules/token").createToken;

// api only

const getWorkoutPlanAPI = require("./modules/API").getWorkoutPlanAPI;
const getTotalPBAPI = require("./modules/API").getTotalPBAPI;

//

//

server.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit: 1000000 }));
server.use(bodyParser.json({ limit: "5mb" }));


// ----------------------------- globale variabler ----------------------- //

const maxCharLength = 20;
const minCharLength = 3;

const day = new Date().getDay();
let dayTxt = "";

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
                    "preferredColorTheme": requestUser.userInfo.settings.preferredColorTheme,
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

     let username = req.body.userInfo;
     username = JSON.parse(username);
     username = username.username;

     if (username) {

          const listOfUsers = await getListOfUsers(username);

          if (listOfUsers.status === true) {

               const respWithUsers = {
                    "allUsers": listOfUsers.allUsers,
                    "allAPIUsers": listOfUsers.allAPIUsers
               }

               res.status(200).json(respWithUsers).end();

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//

// -------------------------------  get list of users on leaderboard ---------------------- //

server.post("/users/list/all/leaderboards", auth, async (req, res) => {

     const resp = await getListOfLeaderboards();

     if (resp.status === true) {

          res.status(200).json(resp.leaderboards).end();

     } else {
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//

// -------------------------------  get list of users on specific leaderboard ---------------------- //

server.post("/users/list/all/leaderboards/:leaderboard", auth, async (req, res) => {

     const leaderboard = req.body.leaderboard;

     if (leaderboard) {

          const listOfUsersLeaderboard = await getListOfUsersLeaderboard(leaderboard);

          if (listOfUsersLeaderboard) {

               res.status(200).json(listOfUsersLeaderboard).end();

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }

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

     if (listOfPendingUsers !== false) {

          if (listOfPendingUsers && listOfPendingUsers !== true) {
               res.status(200).json(listOfPendingUsers).end();
          } else {
               res.status(200).json(`Det finnes ingen forespørseler!`).end();
          }



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

     let userID = req.body.userInfo;
     userID = JSON.parse(userID);
     userID = userID.id;

     const viewingUser = req.body.viewingUser;

     if (userID && viewingUser) {

          const resp = await getUserDetails(viewingUser, userID);

          if (resp.status === true) {
               if (resp.userDetails !== false) {

                    if (viewingUser === userID) {

                         const updatedUserInfo = {
                              "id": resp.userDetails.id,
                              "username": resp.userDetails.username,
                              "displayname": resp.userDetails.displayname,
                              "preferredColorTheme": resp.userDetails.settings.preferredColorTheme,
                         }

                         res.status(200).json({ "info": resp.userDetails, "updatedUserObject": updatedUserInfo }).end();
                    } else {
                         res.status(200).json({ "info": resp.userDetails }).end();
                    }

               } else {

                    if (resp.username) {
                         res.status(403).json(`${resp.username} sin profil er privat!`).end();
                    } else {
                         res.status(403).json(`Brukeren sin profil er privat!`).end();
                    }
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
               "preferredColorTheme": resp.userDetails.settings.preferredColorTheme,
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

// save user lifts & goals

server.post("/user/update/liftOrGoal/:info", auth, async (req, res) => {

     const info = req.body.info;
     const currentUser = JSON.parse(req.body.userInfo);

     if (currentUser.username && info.exercise && info.kg && info.date && info.type === "lift" || info.type === "goal") {

          let isValid = false;

          // fikse slik at den heller teller antall feil og om det er 0 feil, så fortsett!! sånn som i "/user/update/trainingDays/:info"

          const badgeColorValues = Object.entries(badgeColors);

          let color = badgeColorValues[0][0];

          for (let i = 0; i < badgeColorValues.length; i++) {
               if (info.color === badgeColorValues[i][0]) {
                    color = badgeColorValues[i][0];
               }
          }

          for (let i = 0; i < allowedLifts.length; i++) {
               if (info.exercise === allowedLifts[i]) {
                    isValid = true;
               }
          }

          if (isValid === false) {
               for (let i = 0; i < allowedGoals.length; i++) {
                    if (info.exercise === allowedGoals[i]) {
                         isValid = true;
                    }
               }
          }

          if (isValid === true) {
               const saveLiftOrGoalResp = await saveLiftOrGoal(currentUser.username, info.exercise, info.kg, info.date, info.type, color);
               res.status(200).json(saveLiftOrGoalResp).end();
          } else {
               res.status(403).json("invalid information").end();
          }

     } else {
          res.status(403).json("invalid information").end();
     }
});

//

// delete user lifts & goals

server.post("/user/delete/liftOrGoal/:info", auth, async (req, res) => {

     const info = req.body.info;
     const currentUser = JSON.parse(req.body.userInfo);

     if (currentUser.username && info.exercise && info.type === "lift" || info.type === "goal") {

          let isValid = false;

          // fikse slik at den heller teller antall feil og om det er 0 feil, så fortsett!! sånn som i "/user/update/trainingDays/:info"

          for (let i = 0; i < allowedLifts.length; i++) {
               if (info.exercise === allowedLifts[i]) {
                    isValid = true;
               }
          }

          if (isValid === false) {
               for (let i = 0; i < allowedGoals.length; i++) {
                    if (info.exercise === allowedGoals[i]) {
                         isValid = true;
                    }
               }
          }

          if (isValid === true) {
               const saveLiftOrGoalResp = await deleteLiftOrGoal(currentUser.username, info.exercise, info.type);
               res.status(200).json(saveLiftOrGoalResp).end();
          } else {
               res.status(403).json("invalid information").end();
          }

     } else {
          res.status(403).json("invalid information").end();
     }
});

//

// update which days the user is training

server.post("/user/update/trainingDays/:info", auth, async (req, res) => {

     const trainingDays = req.body.trainingDays;
     const currentUser = JSON.parse(req.body.userInfo);

     let isNotValidCounter = 0;

     if (trainingDays[0] !== "none") {

          for (let i = 0; i < trainingDays.length; i++) {
               if (!allowedTrainingDays.includes(trainingDays[i])) {
                    isNotValidCounter++;
               }
          }
     }

     if (isNotValidCounter === 0) {
          const resp = await updateTrainingDays(trainingDays, currentUser.username);

          if (resp === true) {
               res.status(200).json(true).end();
          } else {
               res.status(403).json("error, try again").end();
          }

     } else {
          res.status(403).json("invalid information").end();
     }

});

//

// get list of all people who are working out today (only public users)

server.post("/whoIsWorkingOutToday", auth, async (req, res) => {

     const resp = await getListOfAllUsersWorkoutToday(dayTxt);

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
          { "url": "/getWorkoutInfo/{user}/{key}", "method": "GET" }, // denne brukes som eksempel i API innstillingen
          { "url": "/getTotalPB/{user}/{key}", "method": "GET" },


          { "url": "Kommer snart:", "method": "null" },
          { "url": "hent benk, knebøy, markløft + totalen / og / eller lifts (maks 3? / kan velge)", "method": "null" },
          { "url": "hent mål i ulike løft (maks 3? / kan velge)", "method": "null" },
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

               const program = getWorkoutPlanInfo.info.trainingsplit;
               let firstName = getWorkoutPlanInfo.info.displayname
               firstName = firstName.split(" ");
               firstName = firstName[0];

               let workoutTxt = "";

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

// api

server.get("/getTotalPB/:user/:key", async function (req, res) {

     const url = req.url;
     const urlInfo = url.split("/");

     if (urlInfo[1] === "getTotalPB" && urlInfo[2].length < maxCharLength && urlInfo[3].length < maxCharLength) {
          const user = urlInfo[2];
          const key = urlInfo[3];

          const getTotalPB = await getTotalPBAPI(user, key);

          if (getTotalPB.status === true) {

               const resp = {
                    "user": user,
                    "totalPBKG": getTotalPB.info.kg,
                    "totalPBLBS": getTotalPB.info.lbs,
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
     console.log('Server running', server.get('port'));
})