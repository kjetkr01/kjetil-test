const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit: 1000000 }));
server.use(bodyParser.json({ limit: "5mb" }));


// ----------------------------- Module Requirements ----------------------- //



/* auth */

const auth = require("./modules/auth");

/* */



/* token */

const createToken = require("./modules/token").createToken;

/* */



/* user */

const user = require("./modules/user");
const validateUser = require("./modules/user").validateUser;
const acceptOrDenyUser = require("./modules/user").acceptOrDenyUser;
const updateUserSetting = require("./modules/user").updateUserSetting;
const updateDisplayname = require("./modules/user").updateDisplayname;
const updateUsername = require("./modules/user").updateUsername;
const updatePassword = require("./modules/user").updatePassword;
const updateAboutMe = require("./modules/user").updateAboutMe;
const deleteAccount = require("./modules/user").deleteAccount;
const giveUserAPIAccess = require("./modules/user").giveUserAPIAccess;
const removeUserAPIAccess = require("./modules/user").removeUserAPIAccess;

const saveLiftOrGoal = require("./modules/user").saveLiftOrGoal;
const setGoalAsComplete = require("./modules/user").setGoalAsComplete;
const deleteLiftOrGoal = require("./modules/user").deleteLiftOrGoal;
const decreaseMedalCount = require("./modules/user").decreaseMedalCount;
const createTrainingsplit = require("./modules/user").createTrainingsplit;
const setActiveTrainingsplit = require("./modules/user").setActiveTrainingsplit;
const getTrainingsplit = require("./modules/user").getTrainingsplit;
const deleteTrainingsplit = require("./modules/user").deleteTrainingsplit;
const addExerciseTrainingsplit = require("./modules/user").addExerciseTrainingsplit;
const deleteExerciseTrainingsplit = require("./modules/user").deleteExerciseTrainingsplit;
const addExerciseRowTrainingsplit = require("./modules/user").addExerciseRowTrainingsplit;
const deleteExerciseRowTrainingsplit = require("./modules/user").deleteExerciseRowTrainingsplit;
const changeExerciseOrderTrainingsplit = require("./modules/user").changeExerciseOrderTrainingsplit;
const copyTrainingsplit = require("./modules/user").copyTrainingsplit;
const subUnsubTrainingsplit = require("./modules/user").subUnsubTrainingsplit;
const setNotActiveTrainingsplit = require("./modules/user").setNotActiveTrainingsplit;
const saveTrainingsplit = require("./modules/user").saveTrainingsplit;

/* */



/* get.js */

const getListOfUsers = require("./modules/get").getListOfUsers;
const getListOfLeaderboards = require("./modules/get").getListOfLeaderboards;
const getListOfUsersLeaderboard = require("./modules/get").getListOfUsersLeaderboard;
const getListOfPendingUsers = require("./modules/get").getListOfPendingUsers;
const getWorkoutSplit = require("./modules/get").getWorkoutSplit;
const getUserDetails = require("./modules/get").getUserDetails;
const getUserSettingsAndInfo = require("./modules/get").getUserSettingsAndInfo;
const getListOfAllUsersWorkoutToday = require("./modules/get").getListOfAllUsersWorkoutToday;
const getAllUserInformation = require("./modules/get").getAllUserInformation;

/* */



/* API */

const getWorkoutPlanAPI = require("./modules/API").getWorkoutPlanAPI;
const getTotalPBAPI = require("./modules/API").getTotalPBAPI;

/* */



/* arrayList */

const allowedLifts = require("./arrayLists").allowedLifts;
const allowedGoals = require("./arrayLists").allowedGoals;
const badgeColors = require("./arrayLists").badgeColors;

const allowedTrainingDays = require("./arrayLists").allowedTrainingDays;

/* */

const application = require("./public/ts_application").ts_application;

// ----------------------------- End Of Module Requirements ----------------------- //



// ----------------------------- globale variabler ----------------------- //

const maxCharLength = 20;
const minCharLength = 3;

const APIErrorJSON = {
     catch: { error: "Det har oppstått et problem!" },
     access: { error: "Ingen tilgang" },
     workoutplan: { error: "Brukeren har ingen treningsplan" },
     lift: { error: "Brukeren har ikke alle nødvendige løft for å regne ut totalen. Må ha 1 rep av Benkpress, Knebøy og Markløft" },
}

//

// -------------------------------  get application details ---------------------- //

server.post("/application", async function (req, res) {

     res.status(200).json(application).end();

});

//

// -------------------------------  ask for access / new user ---------------------- //

server.post("/access", async function (req, res) {
     try {
          const credentials = req.body.authorization.split(' ')[1];
          const [username, password, displayname] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

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
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//



// -------------------------------  login / authenticate user ---------------------- //

server.post("/authenticate", async function (req, res) {
     try {
          const credentials = req.body.authorization.split(' ')[1];
          const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

          if (username && password) {

               const requestUser = await validateUser(username, password);
               const isValid = requestUser.isValid;

               if (isValid) {
                    const userInfo = {
                         "id": requestUser.userInfo.id,
                         "username": requestUser.userInfo.username,
                         "displayname": requestUser.userInfo.displayname,
                         "preferredColorTheme": requestUser.userInfo.preferredcolortheme,
                    }
                    const sessionToken = createToken(requestUser.userInfo);
                    res.status(200).json({ "authToken": sessionToken, "user": userInfo }).end();
               } else {
                    res.status(403).json("Brukernavn eller passord er feil!").end();
               }

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//


// -------------------------------  get list of users ---------------------- //

server.post("/users/list/all", auth, async (req, res) => {
     try {
          let username = req.headers.userinfo;
          username = JSON.parse(username);
          username = username.username;

          if (username) {

               const listOfUsers = await getListOfUsers(username);

               if (listOfUsers.status === true) {

                    const respWithUsers = {}

                    if (listOfUsers.allUsers !== null) {
                         respWithUsers.allUsers = listOfUsers.allUsers;
                    }

                    if (listOfUsers.allAPIUsers !== null) {
                         respWithUsers.allAPIUsers = listOfUsers.allAPIUsers;
                    }

                    res.status(200).json(respWithUsers).end();

               } else {
                    res.status(403).json(`Feil, prøv igjen`).end();
               }

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// -------------------------------  get list of users on leaderboard ---------------------- //

server.post("/users/list/all/leaderboards", auth, async (req, res) => {
     try {

          const reps = req.body.reps || "1";

          const resp = await getListOfLeaderboards(reps);

          if (resp.status === true) {

               res.status(200).json({ "leaderboards": resp.leaderboards, "repsList": resp.repsList }).end();

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }

});

//

// -------------------------------  get list of users on specific leaderboard ---------------------- //

server.post("/users/list/all/leaderboards/:leaderboard", auth, async (req, res) => {

     try {
          const leaderboard = req.body.leaderboard;
          const reps = req.body.reps || "1";

          if (leaderboard) {

               const listOfUsersLeaderboard = await getListOfUsersLeaderboard(leaderboard, reps);

               if (listOfUsersLeaderboard) {

                    res.status(200).json(listOfUsersLeaderboard).end();

               } else {
                    res.status(403).json(`Feil, prøv igjen`).end();
               }

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//


// -------------------------------  get list of pending users (requests) ---------------------- //

server.post("/users/list/pending", auth, async (req, res) => {
     try {

          let onlyNumbers = false;

          if (req.body.onlyNumbers) {
               onlyNumbers = true;
          }

          let username = req.headers.userinfo;
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
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// -------------------------------  accept or deny pending user ---------------------- //

server.post("/users/pending/:user/:acceptOrDeny", auth, async (req, res) => {
     try {

          let username = req.headers.userinfo;
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
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// -------------------------------  whatToTrainToday (user) ---------------------- //

server.post("/user/whatToTrainToday", auth, async (req, res) => {
     try {

          let username = req.headers.userinfo;
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
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// -------------------------------  get user details (view userPage) ---------------------- //

server.post("/users/details/:user", auth, async (req, res) => {
     try {

          let userID = req.headers.userinfo;
          userID = JSON.parse(userID);
          userID = parseInt(userID.id);

          const viewingUser = parseInt(req.body.viewingUser);

          if (typeof viewingUser === "number" && typeof userID === "number") {
               if (userID && viewingUser) {

                    const resp = await getUserDetails(viewingUser, userID);

                    if (resp.status === true) {
                         if (resp.userDetails !== false) {

                              const cacheDetails = {
                                   "displayname": resp.userDetails.displayname,
                                   "gym": resp.userDetails.info.gym,
                                   "age": resp.userDetails.info.age,
                                   "height": resp.userDetails.info.height,
                                   "weight": resp.userDetails.info.weight,
                                   "member_since": resp.userDetails.member_since,
                                   "medalscount": resp.userDetails.info.medalscount
                              }

                              if (viewingUser === userID) {

                                   const updatedUserInfo = {
                                        "id": resp.userDetails.id,
                                        "username": resp.userDetails.username,
                                        "displayname": resp.userDetails.displayname,
                                        "preferredColorTheme": resp.userDetails.settings.preferredcolortheme,
                                        "preferredTheme": resp.userDetails.settings.preferredtheme,
                                        "automaticUpdates": resp.userDetails.settings.automaticupdates,
                                        "badgesize": resp.userDetails.settings.badgesize,
                                        "badgedetails": resp.userDetails.settings.badgedetails
                                   }

                                   cacheDetails.id = resp.userDetails.id;
                                   cacheDetails.username = resp.userDetails.username;
                                   cacheDetails.isadmin = resp.userDetails.isadmin;
                                   cacheDetails.apikey = resp.userDetails.apikey;

                                   res.status(200).json({ "info": resp.userDetails, "updatedUserObject": updatedUserInfo, "cacheDetails": cacheDetails }).end();
                              } else {
                                   res.status(200).json({ "info": resp.userDetails, "cacheDetails": cacheDetails }).end();
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
          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// get user settings and info

server.post("/user/details/settingsInfo", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);

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
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid user").end();
     }
});

//

// update user settings

server.post("/user/update/settings/:setting", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const setting = req.body.updateSetting;
          let value = req.body.value;

          const EAllowedSettings = {
               "publicprofile": [true, false],
               "displayleaderboards": [true, false],
               "displayworkoutlist": [true, false],
               "preferredtheme": ["0", "1", "2"],
               "preferredcolortheme": ["0", "1", "2"],
               "badgesize": ["0", "1"],
               "badgedetails": ["0", "1", "2"],
               "automaticupdates": [true, false],
               "leaderboards_filter_reps": ["bypass"],
               "display_lifts_owner": ["bypass", "check-lifts"],
               "display_goals_owner": ["bypass", "check-goals"],
          }

          if (EAllowedSettings[setting] && currentUser.username && EAllowedSettings[setting].includes(value) || EAllowedSettings[setting][0] === "bypass") {

               if (EAllowedSettings[setting][1] === "check-lifts") {
                    if (!allowedLifts.includes(value)) {
                         value = null;
                    }
               }
               else if (EAllowedSettings[setting][1] === "check-goals") {
                    if (!allowedGoals.includes(value)) {
                         value = null;
                    }
               }

               const resp = await updateUserSetting(currentUser.username, setting, value);

               if (resp === true) {
                    res.status(200).json(resp).end();
               } else {
                    res.status(403).json("error, try again").end();
               }

          } else {
               res.status(403).json("invalid user").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid user").end();
     }
});

//

// update displayname

server.post("/user/update/displayname", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const newDisplayname = req.body.newDisplayname;

          const letters = /^[A-Za-z0-9 ]+$/;

          if (newDisplayname.match(letters)) {
               if (newDisplayname.length >= 3 && newDisplayname.length <= 20 && currentUser.username) {

                    const resp = await updateDisplayname(currentUser.username, newDisplayname);

                    if (resp === true) {
                         res.status(200).json(resp).end();
                    } else {
                         res.status(403).json("error, try again").end();
                    }

               } else {
                    res.status(403).json("invalid displayname").end();
               }

          } else {
               res.status(403).json("invalid displayname").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid displayname").end();
     }
});

//

// update username

server.post("/user/update/username", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const newUsername = req.body.newUsername;

          const letters = /^[A-Za-z0-9]+$/;

          if (newUsername.match(letters)) {
               if (newUsername.length >= 3 && newUsername.length <= 20 && currentUser.username) {

                    const resp = await updateUsername(currentUser.username, newUsername);

                    if (resp === true) {
                         res.status(200).json(resp).end();
                    } else {
                         res.status(403).json("error, try again").end();
                    }

               } else {
                    res.status(403).json("invalid username").end();
               }

          } else {
               res.status(403).json("invalid username").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid username").end();
     }
});

//


// update password

server.post("/user/update/password", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const credentials = req.body.authorization.split(' ')[1];
          const [exsistingPsw, newPsw] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

          if (currentUser.id && exsistingPsw && newPsw) {
               if (exsistingPsw !== newPsw) {

                    const resp = await updatePassword(currentUser.id, exsistingPsw, newPsw);

                    if (resp.status === true) {
                         res.status(200).json(resp).end();
                    } else {
                         res.status(403).json(resp).end();
                    }

               } else {
                    res.status(403).json({ "status": false, "message": "Passordet ble ikke endret. Eksisterende passord og nytt passord er like" }).end();
               }

          } else {
               res.status(403).json({ "status": false, "message": "Det har oppstått en feil" }).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json({ "status": false, "message": "Det har oppstått en feil" }).end();
     }
});

//


// update about me information

server.post("/user/update/settings/about/me", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const settings = req.body.updateSettings;

          if (settings.hasOwnProperty("gym") && settings.hasOwnProperty("age") && settings.hasOwnProperty("height") && settings.hasOwnProperty("weight") && currentUser.hasOwnProperty("username")) {

               let info = {
                    isValid: true,
                    msg: ""
               };

               if (settings.age < 0) {
                    settings.age = 0;
               }

               if (settings.height < 0) {
                    settings.height = 0;
               }

               if (settings.weight < 0) {
                    settings.weight = 0;
               }

               const gym = settings.gym || "";
               const age = parseInt(settings.age) || 0;
               const height = parseFloat(settings.height) || 0;
               const weight = parseFloat(settings.weight) || 0;

               const maxGymNameLength = 30;
               const maxAge = 100;
               const maxHeight = 205;
               const maxWeight = 140;

               const letters = /^[ÆØÅæøåA-Za-z0-9\s]+$/;

               if (settings.gym.length > maxGymNameLength || !gym.match(letters) && gym !== "") {
                    info.isValid = false;
                    if (!gym.match(letters)) {
                         info.msg = `Treningssenter er ugyldig`;
                    } else {
                         info.msg = `Treningssenter kan ikke overskride ${maxGymNameLength} bokstaver`;
                    }
               }
               else if (settings.age.length > 2 || isNaN(age) === true || age > maxAge) {
                    info.isValid = false;
                    info.msg = `Alder kan ikke overskride ${maxAge} år`;
               }
               else if (settings.height.length > 6 || isNaN(height) === true || height > maxHeight) {
                    info.isValid = false;
                    info.msg = `Høyde kan ikke overskride ${maxHeight} cm`;
               }
               else if (settings.weight.length > 6 || isNaN(weight) === true || weight > maxWeight) {
                    info.isValid = false;
                    info.msg = `Vekt kan ikke overskride ${maxWeight} kg`;
               }

               if (info.isValid === true) {

                    const updateSettings = {
                         gym: gym,
                         age: age,
                         height: height,
                         weight: weight
                    }

                    const resp = await updateAboutMe(currentUser.username, updateSettings);

                    if (resp === true) {
                         res.status(200).json("Endringer har blitt oppdatert!").end();
                    } else {
                         res.status(403).json("error, try again").end();
                    }
               } else {
                    res.status(403).json(info.msg).end();
               }

          } else {
               res.status(403).json("invalid settings").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid settings").end();
     }
});

//



// save user lifts & goals

server.post("/user/update/liftOrGoal/:info", auth, async (req, res) => {
     try {

          const info = req.body.info;
          const currentUser = JSON.parse(req.headers.userinfo);
          const maxKG = 300;
          const maxReps = 100;

          if (currentUser.id && info.exercise && info.date && info.type === "lift" || info.type === "goal") {

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

               if (info.kg < 1) {
                    info.kg = 1;
               } else if (info.kg > maxKG) {
                    info.kg = maxKG;
               }

               if (info.reps < 1) {
                    info.reps = 1;
               } else if (info.reps > maxReps) {
                    info.reps = maxReps;
               }

               if (isValid === true) {
                    if (info.reps > 0) {
                         info.reps = info.reps.toString();
                    } else {
                         isValid = false;
                    }
               }

               if (isValid === true) {
                    const saveLiftOrGoalResp = await saveLiftOrGoal(currentUser.id, info, color);
                    res.status(200).json(saveLiftOrGoalResp).end();
               } else {
                    res.status(403).json("invalid information").end();
               }

          } else {
               res.status(403).json("invalid information").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// set goal as completed and increment medals count

server.post("/user/update/goals/completed", auth, async (req, res) => {
     try {

          const completedGoalsList = req.body.completedGoalsList;
          const currentUser = JSON.parse(req.headers.userinfo);

          if (currentUser.id) {

               const resp = await setGoalAsComplete(currentUser.id, completedGoalsList);

               if (resp.status === true) {
                    res.status(200).json(resp).end();
               } else {
                    res.status(403).json({ "status": false }).end();
               }

          } else {
               res.status(403).json("invalid information").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// decrease medals count

server.post("/user/details/decrease/medalscount", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          let count = parseInt(req.body.count);
          if (isNaN(count)) {
               count = 1;
          }

          if (currentUser.id) {

               const decreaseMedalCountResp = await decreaseMedalCount(currentUser.id, count);
               res.status(200).json(decreaseMedalCountResp).end();

          } else {
               res.status(403).json("invalid information").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// delete user lifts & goals

server.post("/user/delete/liftOrGoal/:info", auth, async (req, res) => {
     try {

          const info = req.body.info;
          const currentUser = JSON.parse(req.headers.userinfo);

          if (currentUser.id && info.exercise && info.type === "lift" || info.type === "goal") {

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
                    const saveLiftOrGoalResp = await deleteLiftOrGoal(currentUser.id, info);
                    res.status(200).json(saveLiftOrGoalResp).end();
               } else {
                    res.status(403).json("invalid information").end();
               }

          } else {
               res.status(403).json("invalid information").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// create new trainingsplit

server.post("/user/create/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);

          const resp = await createTrainingsplit(currentUser.id);

          if (resp.status === true) {
               res.status(200).json(resp.newtrainingsplit_id).end();
          } else {
               res.status(403).json("error, try again").end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// set active trainingsplit

server.post("/user/setactive/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);

          if (!isNaN(trainingsplit_id)) {

               const resp = await setActiveTrainingsplit(currentUser.id, trainingsplit_id);

               if (resp === true) {
                    res.status(200).json(true).end();
               } else {
                    res.status(403).json("error, try again").end();
               }
          } else {
               res.status(403).json("error, try again").end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// get trainingsplit

server.post("/user/get/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);

          if (!isNaN(trainingsplit_id)) {

               const resp = await getTrainingsplit(currentUser.id, trainingsplit_id);

               if (resp.status === true) {
                    res.status(200).json(resp.trainingsplit).end();
               } else {
                    res.status(403).json("error, try again").end();
               }
          } else {
               res.status(403).json("error, try again").end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// delete trainingsplit

server.post("/user/delete/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);

          if (!isNaN(trainingsplit_id)) {

               const resp = await deleteTrainingsplit(currentUser.id, trainingsplit_id);

               if (resp === true) {
                    res.status(200).json(true).end();
               } else {
                    res.status(403).json("error, try again").end();
               }
          } else {
               res.status(403).json("error, try again").end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// add exercise to trainingsplit

server.post("/user/add/trainingsplit/exercise", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const exercise = req.body.exercise;
          const day = req.body.day;

          if (!isNaN(trainingsplit_id)) {

               const maxExerciseLength = 30;

               if (exercise.length <= maxExerciseLength || allowedLifts.includes(exercise.toLowerCase())) {
                    const resp = await addExerciseTrainingsplit(currentUser.id, trainingsplit_id, exercise, day);

                    if (resp.status === true) {
                         res.status(200).json(resp.status).end();
                    } else {
                         res.status(403).json(resp).end();
                    }
               } else {
                    res.status(403).json({ "status": false, "msg": `Navnet på øvelsen kan ikke være lengre enn ${maxCharLength} bokstaver!` }).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//


// add row to exercise trainingsplit

server.post("/user/add/trainingsplit/exercise/row", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const exercise = req.body.exercise;
          const day = req.body.day;

          if (!isNaN(trainingsplit_id)) {

               const resp = await addExerciseRowTrainingsplit(currentUser.id, trainingsplit_id, exercise, day);

               if (resp.status === true) {
                    res.status(200).json(resp.status).end();
               } else {
                    res.status(403).json(resp).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//


// delete row to exercise trainingsplit

server.post("/user/delete/trainingsplit/exercise/row", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const exercise = req.body.exercise;
          const index = req.body.index;
          const day = req.body.day;

          if (!isNaN(trainingsplit_id)) {

               const resp = await deleteExerciseRowTrainingsplit(currentUser.id, trainingsplit_id, exercise, index, day);

               if (resp.status === true) {
                    res.status(200).json(resp.status).end();
               } else {
                    res.status(403).json(resp).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// move exercise trainingsplit

server.post("/user/update/trainingsplit/exercise/move", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const day = req.body.day;
          const index = req.body.index;
          const moveUp = req.body.moveUp;

          if (!isNaN(trainingsplit_id)) {

               const resp = await changeExerciseOrderTrainingsplit(currentUser.id, trainingsplit_id, day, index, moveUp);

               if (resp.status === true) {
                    res.status(200).json(resp.status).end();
               } else {
                    res.status(403).json(resp).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// delete exercise from trainingsplit

server.post("/user/delete/trainingsplit/exercise", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const exercise = req.body.exercise;
          const day = req.body.day;

          if (!isNaN(trainingsplit_id)) {

               const resp = await deleteExerciseTrainingsplit(currentUser.id, trainingsplit_id, exercise, day);

               if (resp.status === true) {
                    res.status(200).json(resp.status).end();
               } else {
                    res.status(403).json(resp).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//


// copy trainingsplit

server.post("/user/copy/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const owner_id = req.body.owner_id;

          if (!isNaN(trainingsplit_id)) {

               const resp = await copyTrainingsplit(currentUser.id, trainingsplit_id, owner_id);

               if (resp.status === true) {
                    res.status(200).json(resp).end();
               } else {
                    res.status(403).json(resp).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// sub unsub trainingsplit

server.post("/user/subunsub/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const owner_id = req.body.owner_id;

          if (!isNaN(trainingsplit_id)) {

               const resp = await subUnsubTrainingsplit(currentUser.id, trainingsplit_id, owner_id);

               if (resp.status === true) {
                    res.status(200).json(resp).end();
               } else {
                    res.status(403).json(resp).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// setnotactive trainingsplit

server.post("/user/setnotactive/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const resp = await setNotActiveTrainingsplit(currentUser.id);

          if (resp === true) {
               res.status(200).json(true).end();
          } else {
               res.status(403).json(false).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// save trainingsplit

server.post("/user/save/trainingsplit", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const day = req.body.day;
          const list = req.body.list;
          const trainingsplit_name = req.body.trainingsplit_name;
          const mostCountExercises = req.body.mostCountExercises;

          let shortTxt = "Annet";
          if (list.length > 0) {
               if (mostCountExercises.length > 0) {

                    const txt = mostCountExercises.toString().toLowerCase();

                    const shortList = {
                         "Bryst": ["benkpress", "skråbenk", "benk", "flies", "pushup"],
                         "Skuldre": ["skulderpress", "skulder", "skuldre", "overhead", "raise"],
                         "Rygg": ["markløft", "pullup", "roing", "row", "hyperextension"],
                         "Biceps": ["bicep", "curl", "hammer"],
                         "Triceps": ["tricep", "pushdown", "dip", "crusher"],
                         "Bein": ["knebøy", "leg", "hamstring", "lunge", "utfall"],
                         "Mage": ["situp", "plank", "crunch", "abs", "roll"],
                    }

                    // shortList and keywords (saveTrainingsplit in account/editInformation.js ~ line 960) should be equal

                    const shortListKeys = Object.keys(shortList);
                    const names = [];

                    for (let i = 0; i < shortListKeys.length; i++) {

                         const current = shortListKeys[i];
                         const keywords = shortList[current];

                         for (let j = 0; j < keywords.length; j++) {
                              const keyword = keywords[j];
                              if (txt.includes(keyword)) {
                                   if (!names.includes(current)) {
                                        names.push(current);
                                        break;
                                   }
                              }
                         }
                    }

                    if (names.length >= 2) {
                         shortTxt = `${names[0]} og ${names[1]}`;
                    } else if (names.length >= 1) {
                         shortTxt = names[0];
                    }

               }
          } else {
               shortTxt = "";
          }

          const trainingsplit_short = shortTxt;

          if (!isNaN(trainingsplit_id)) {

               const resp = await saveTrainingsplit(currentUser.id, trainingsplit_id, day, list, trainingsplit_name, trainingsplit_short);

               if (resp === true) {
                    res.status(200).json("saved").end();
               } else {
                    res.status(403).json("error").end();
               }

          } else {
               res.status(403).json("error").end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});

//

// get list of all people who are working out today (only public users)

server.post("/whoIsWorkingOutToday", auth, async (req, res) => {
     try {

          const resp = await getListOfAllUsersWorkoutToday();

          if (resp.status === true) {
               res.status(200).json(resp.info).end();
          } else {
               res.status(403).json("error, try again").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("error, try again").end();
     }
});

//

// get all information about user

server.post("/user/allinformation", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);

          if (currentUser.id) {

               const resp = await getAllUserInformation(currentUser.id);
               /* { "status": true, "information": { "username": "kjetkr01", "displayname": "yeet yeetson" } } */
               if (resp.status === true) {
                    res.status(200).json(resp.information).end();
               } else {
                    res.status(403).json("Kunne ikke hente informasjon").end();
               }
          } else {
               res.status(403).json("Invalid user").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("Invalid user").end();
     }
});

//

// delete my account

server.post("/user/deleteMe", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);

          const credentials = req.body.authorization.split(' ')[1];
          const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

          if (currentUser.username && username && password) {

               if (currentUser.username === username) {

                    const resp = await deleteAccount(currentUser.username, password);

                    if (resp === true) {
                         res.status(200).json({ "status": true, "message": "Brukeren din er nå slettet." }).end();
                    } else {
                         res.status(200).json({ "status": false, "message": "Brukernavnet eller passordet er feil" }).end();
                    }

               } else {
                    res.status(403).json({ "status": false, "message": "Brukernavnet stemmer ikke med kontoen" }).end();
               }

          } else {
               res.status(403).json({ "status": false, "message": "Vennligst fyll ut alle feltene" }).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json({ "status": false, "message": "Vennligst fyll ut alle feltene" }).end();
     }
});

//

// test

server.post("/validate", auth, async (req, res) => {

     //const currentUser = JSON.parse(req.headers.userinfo);

     //console.log("valid, current user: " + currentUser.username); // test / grei log i terminal

     res.status(200).json({ "status": "ok" }).end();

});

//

// get list of different api

server.get("/api", function (req, res) {

     const userIDText = "brukerID";
     const keyText = "key";

     const resp = [
          { "url": `/getWorkoutInfo/{${userIDText}}/{${keyText}}`, "method": "GET" }, // denne brukes som eksempel i API innstillingen
          { "url": `/getTotalPB/{${userIDText}}/{${keyText}}`, "method": "GET" },
     ];

     // Ideer:
     // hent benk, knebøy, markløft + totalen / og / eller lifts (maks 3? / kan velge)
     // hent mål i ulike løft (maks 3? / kan velge)

     res.status(200).json(resp).end();
});

//

// -------------------------------  give user api access ---------------------- //

server.post("/user/giveAPIAccess", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const giveAPIUserAccess = req.body.giveAPIUserAccess;

          if (currentUser.username && giveAPIUserAccess) {

               const resp = await giveUserAPIAccess(currentUser.username, giveAPIUserAccess);

               if (resp === true) {
                    res.status(200).json(true).end();
               } else {
                    res.status(403).json(false).end();
               }

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// -------------------------------  remove user api access ---------------------- //

server.post("/user/removeAPIAccess", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const removeAPIAccess = req.body.removeAPIUserAccess;

          if (currentUser.username && removeAPIAccess) {

               const resp = await removeUserAPIAccess(currentUser.username, removeAPIAccess);

               if (resp === true) {
                    res.status(200).json(true).end();
               } else {
                    res.status(403).json(false).end();
               }

          } else {
               res.status(403).json(`Feil, prøv igjen`).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Feil, prøv igjen`).end();
     }
});

//

// api

server.get("/getWorkoutInfo/:user/:key", async function (req, res) {
     try {

          const url = req.url;
          const urlInfo = url.split("/");

          if (urlInfo[1] === "getWorkoutInfo" && urlInfo[2].length < maxCharLength && urlInfo[3].length < maxCharLength) {
               const user = urlInfo[2];
               const key = urlInfo[3];

               const getWorkoutPlanInfo = await getWorkoutPlanAPI(user, key);

               if (getWorkoutPlanInfo.status === true) {

                    const workout = getWorkoutPlanInfo.info.workout;
                    let firstName = getWorkoutPlanInfo.info.displayname
                    firstName = firstName.split(" ");
                    firstName = firstName[0];

                    let workoutTxt = "";

                    if (getWorkoutPlanInfo.isOwner === true) {

                         if (workout && workout.length > 0 && workout !== "Fri") {
                              workoutTxt = `Skal du trene ${workout}`;
                         } else {
                              workoutTxt = `Skal du ikke trene`;
                         }

                    } else {

                         if (workout && workout.length > 0 && workout !== "Fri") {
                              workoutTxt = `Trener ${firstName} ${workout}`;
                         } else {
                              workoutTxt = `Trener ikke ${firstName}`;
                         }
                    }

                    const days = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
                    const dayNum = new Date().getDay();

                    const day = days[dayNum];

                    const resp = {
                         "currentDay": day,
                         "todaysWorkout": workoutTxt
                    }

                    res.status(200).json(resp).end();

               } else {
                    res.status(403).json(APIErrorJSON.workoutplan).end();
               }

          } else {
               res.status(403).json(APIErrorJSON.access).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(APIErrorJSON.catch).end();
     }
})


//

// api

server.get("/getTotalPB/:user/:key", async function (req, res) {
     try {

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
                    res.status(403).json(APIErrorJSON.lift).end();
               }

          } else {
               res.status(403).json(APIErrorJSON.access).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(APIErrorJSON.catch).end();
     }
})


//



// ------------------------------- allows the server to run on localhost  ------------------------------- //

server.listen(server.get('port'), function () {
     console.log('Server running', server.get('port'));
})