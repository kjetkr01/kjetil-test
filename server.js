const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit: 1000000 }));
server.use(bodyParser.json({ limit: "5mb" }));


/// -------------------- Module Requirements -------------------- ///

// auth.js
const auth = require("./modules/auth");

// token.js
const createToken = require("./modules/token").createToken;

// user.js
const user = require("./modules/mw/user"),
     validateUser = require("./modules/mw/user").validateUser,
     acceptOrDenyUser = require("./modules/mw/user").acceptOrDenyUser,
     deleteAccount = require("./modules/mw/user").deleteAccount,
     giveUserAPIAccess = require("./modules/mw/user").giveUserAPIAccess,
     removeUserAPIAccess = require("./modules/mw/user").removeUserAPIAccess,
     decreaseMedalCount = require("./modules/mw/user").decreaseMedalCount,

     updateUserSetting = require("./modules/mw/user").updateUserSetting,
     updateDisplayname = require("./modules/mw/user").updateDisplayname,
     updateUsername = require("./modules/mw/user").updateUsername,
     updatePassword = require("./modules/mw/user").updatePassword,
     updateAboutMe = require("./modules/mw/user").updateAboutMe;

// trainingsplit.js
const createTrainingsplit = require("./modules/mw/trainingsplit").createTrainingsplit,
     deleteTrainingsplit = require("./modules/mw/trainingsplit").deleteTrainingsplit,
     saveTrainingsplit = require("./modules/mw/trainingsplit").saveTrainingsplit,
     getTrainingsplit = require("./modules/mw/trainingsplit").getTrainingsplit,
     getAllTrainingsplits = require("./modules/mw/trainingsplit").getAllTrainingsplits,
     copyTrainingsplit = require("./modules/mw/trainingsplit").copyTrainingsplit,
     subUnsubTrainingsplit = require("./modules/mw/trainingsplit").subUnsubTrainingsplit,
     setActiveTrainingsplit = require("./modules/mw/trainingsplit").setActiveTrainingsplit,
     setNotActiveTrainingsplit = require("./modules/mw/trainingsplit").setNotActiveTrainingsplit,
     changeTrainingsplitVisibility = require("./modules/mw/trainingsplit").changeTrainingsplitVisibility,
     addExerciseTrainingsplit = require("./modules/mw/trainingsplit").addExerciseTrainingsplit,
     deleteExerciseTrainingsplit = require("./modules/mw/trainingsplit").deleteExerciseTrainingsplit,
     changeExerciseOrderTrainingsplit = require("./modules/mw/trainingsplit").changeExerciseOrderTrainingsplit,
     addExerciseRowTrainingsplit = require("./modules/mw/trainingsplit").addExerciseRowTrainingsplit,
     deleteExerciseRowTrainingsplit = require("./modules/mw/trainingsplit").deleteExerciseRowTrainingsplit;

// liftOrGoal.js
const saveLiftOrGoal = require("./modules/mw/liftOrGoal").saveLiftOrGoal,
     deleteLiftOrGoal = require("./modules/mw/liftOrGoal").deleteLiftOrGoal,
     setGoalAsComplete = require("./modules/mw/liftOrGoal").setGoalAsComplete;

// get.js
const getListOfUsers = require("./modules/mw/get").getListOfUsers,
     getListOfLeaderboards = require("./modules/mw/get").getListOfLeaderboards,
     getListOfUsersLeaderboard = require("./modules/mw/get").getListOfUsersLeaderboard,
     getListOfPendingUsers = require("./modules/mw/get").getListOfPendingUsers,
     getUserDetails = require("./modules/mw/get").getUserDetails,
     getUserSettingsAndInfo = require("./modules/mw/get").getUserSettingsAndInfo,
     getListOfAllUsersWorkoutToday = require("./modules/mw/get").getListOfAllUsersWorkoutToday,
     getAllUserInformation = require("./modules/mw/get").getAllUserInformation;

// API.js
const getWorkoutPlanAPI = require("./modules/mw/API").getWorkoutPlanAPI,
     getTotalPBAPI = require("./modules/mw/API").getTotalPBAPI,
     getLiftsAPI = require("./modules/mw/API").getLiftsAPI;

// customlist.js
const ECustomList = require("./modules/customList").ECustomList;

// ts_application.js
const application = require("./public/ts_application").ts_application;

/// -------------------- End of Module Requirements -------------------- ///



/// -------------------- Global Variables -------------------- ///

// maximum username / displayname length
const maxCharLength = 20,
     minCharLength = 3;

const APIErrorJSON = {
     catch: { error: "Det har oppstått et problem!" },
     access: { error: "Ingen tilgang" },
     workoutplan: { error: "Brukeren har ingen aktiv treningsplan" },
     lift: { error: "Brukeren har ikke alle nødvendige løft for å regne ut totalen. Må ha 1 rep av Benkpress, Knebøy og Markløft" },
}

/// -------------------- End of Global Variables -------------------- ///

// get application details
server.post("/application", async function (req, res) {
     res.status(200).json(application).end();
});
// End of /application POST

/// -------------------- Login & Ask for access -------------------- ///

// login / authenticate user
server.post("/authenticate", async function (req, res) {
     try {
          const credentials = req.body.authorization.split(' ')[1];
          const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

          if (username && password) {

               const requestUser = await validateUser(username, password);

               if (requestUser.status === true) {

                    const userInfo = {
                         "id": requestUser.userInfo.id,
                         "username": requestUser.userInfo.username,
                         "displayname": requestUser.userInfo.displayname,
                         "settings": requestUser.userInfo.settings,
                         "details": requestUser.userInfo.details,
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
// End of /autenticate POST

// ask for access / new user
server.post("/access", async function (req, res) {
     try {
          const credentials = req.body.authorization.split(' ')[1];
          const [username, password, displayname] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

          if (username && password && displayname) {

               if (username.length < maxCharLength || username.length > minCharLength) {

                    if (displayname.length < maxCharLength || displayname.length > minCharLength) {

                         const newUser = new user(username, password, displayname);
                         const resp = await newUser.addToPendingList();

                         if (resp === null) {
                              res.status(401).json("Brukernavnet er opptatt!").end();
                         } else {
                              res.status(200).json("Du har nå bedt om tilgang!").end();
                         }

                    } else {
                         res.status(401).json(`Visningsnavnet må være mellom ${minCharLength} og ${maxCharLength} tegn!`).end();
                    }

               } else {
                    res.status(401).json(`Brukernavnet må være mellom ${minCharLength} og ${maxCharLength} tegn!`).end();
               }

          } else {
               res.status(403).json("Vennligst fyll ut alle feltene!").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(`Det har oppstått en feil, vennligst prøv igjen`).end();
     }
});
// End of /access POST


/// -------------------- End of Login & Ask for access -------------------- ///

/// -------------------- User -------------------- ///

// get user details (view userPage)
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
                                        "displayname": resp.userDetails.displayname
                                   }

                                   delete cacheDetails.displayname;
                                   cacheDetails.isadmin = resp.userDetails.isadmin;
                                   cacheDetails.apikey = resp.userDetails.apikey;

                                   res.status(200).json({ "info": resp.userDetails, "updatedUserObject": updatedUserInfo, "userDetails": cacheDetails }).end();
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
// End of /users/details/:user POST

// update displayname
server.post("/user/update/displayname", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const newDisplayname = req.body.newDisplayname;

          const letters = /^[A-Za-z0-9 ]+$/;

          if (newDisplayname.match(letters)) {
               if (newDisplayname.length >= 3 && newDisplayname.length <= 20) {

                    const resp = await updateDisplayname(currentUser.id, newDisplayname);

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
// End of /user/update/displayname POST

// update username
server.post("/user/update/username", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const newUsername = req.body.newUsername;

          const letters = /^[A-Za-z0-9]+$/;

          if (newUsername.match(letters)) {
               if (newUsername.length >= 3 && newUsername.length <= 20) {

                    const resp = await updateUsername(currentUser.id, newUsername);

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
// End of /user/update/username POST

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
// End of /user/update/password POST

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

               const maxGymNameLength = 30;
               const maxAge = 100;
               const maxHeight = 205;
               const maxWeight = 140;

               if (settings.age < 0) {
                    settings.age = 0;
               } else if (settings.age > maxAge) {
                    settings.age = maxAge;
               }

               if (settings.height < 0) {
                    settings.height = 0;
               } else if (settings.height > maxHeight) {
                    settings.height = maxHeight;
               }

               if (settings.weight < 0) {
                    settings.weight = 0;
               } else if (settings.weight > maxWeight) {
                    settings.weight = maxWeight;
               }

               const gym = settings.gym || "";
               const age = parseInt(settings.age) || 0;
               const height = parseFloat(settings.height) || 0;
               const weight = parseFloat(settings.weight) || 0;

               const letters = /^[ÆØÅæøåA-Za-z0-9\s]+$/;

               if (settings.gym.length > maxGymNameLength || !gym.match(letters) && gym !== "") {
                    info.isValid = false;
                    if (!gym.match(letters)) {
                         info.msg = `Treningssenter er ugyldig`;
                    } else {
                         info.msg = `Treningssenter kan ikke overskride ${maxGymNameLength} bokstaver`;
                    }
               }

               if (info.isValid === true) {

                    const updateSettings = {
                         gym: gym,
                         age: age,
                         height: height,
                         weight: weight
                    }

                    const resp = await updateAboutMe(currentUser.id, updateSettings);

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
// End of /user/update/settings/about/me POST

// get user settings and info
server.post("/user/details/settingsInfo", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);

          const resp = await getUserSettingsAndInfo(currentUser.id);

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

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid user").end();
     }
});
// End of /user/details/settingsInfo POST

// update user settings
server.post("/user/update/settings/:setting", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const setting = req.body.updateSetting;
          let value = req.body.value;

          if (ECustomList.allowed.settings[setting]) {

               if (ECustomList.allowed.settings[setting].includes(value) || ECustomList.allowed.settings[setting][0] === "bypass") {

                    const savedValue = value;

                    if (ECustomList.allowed.settings[setting][1] === "check-lifts") {
                         for (let i = 0; i < ECustomList.allowed.lifts.length; i++) {
                              if (ECustomList.allowed.lifts[i] === savedValue) {
                                   value = savedValue;
                                   break;
                              } else {
                                   value = null;
                              }
                         }
                    }
                    else if (ECustomList.allowed.settings[setting][1] === "check-goals") {
                         for (let i = 0; i < ECustomList.allowed.goals.length; i++) {
                              if (ECustomList.allowed.goals[i] === savedValue) {
                                   value = savedValue;
                                   break;
                              } else {
                                   value = null;
                              }
                         }
                    }

                    const resp = await updateUserSetting(currentUser.id, setting, value);

                    if (resp === true) {
                         res.status(200).json(resp).end();
                    } else {
                         res.status(403).json("error, try again").end();
                    }

               } else {
                    res.status(403).json("invalid setting value").end();
               }

          } else {
               res.status(403).json("invalid setting").end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json("invalid user").end();
     }
});
// End of /user/update/settings/:setting POST

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
// End of /user/details/decrease/medalscount POST

// get all information about user
server.get("/user/allinformation", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);

          if (currentUser.id) {

               const resp = await getAllUserInformation(currentUser.id);

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
// End of /user/allinformation GET

// delete my account
server.post("/user/deleteMe", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);

          const credentials = req.body.authorization.split(' ')[1];
          const [username, password] = Buffer.from(credentials, 'base64').toString('UTF-8').split(":");

          if (username && password) {

               if (currentUser.username === username) {

                    const resp = await deleteAccount(currentUser.id, password);

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
// End of /user/deleteMe POST

/// -------------------- End of User -------------------- ///

/// -------------------- Lift & Goal -------------------- ///

// save user lifts & goals
server.post("/user/update/liftOrGoal/:info", auth, async (req, res) => {
     try {

          const info = req.body.info;
          const currentUser = JSON.parse(req.headers.userinfo);
          const maxKG = 300;
          const maxReps = 100;

          if (currentUser.id && info.exercise && info.date && info.type === "lift" || info.type === "goal") {

               let isValid = false;

               const badgeColorValues = Object.entries(ECustomList.other.badgeColors);

               let color = badgeColorValues[0][0];

               for (let i = 0; i < badgeColorValues.length; i++) {
                    if (info.color === badgeColorValues[i][0]) {
                         color = badgeColorValues[i][0];
                    }
               }

               if (info.type === "lift") {
                    for (let i = 0; i < ECustomList.allowed.lifts.length; i++) {
                         if (info.exercise === ECustomList.allowed.lifts[i]) {
                              isValid = true;
                              break;
                         }
                    }
               } else if (info.type === "goal") {
                    for (let i = 0; i < ECustomList.allowed.goals.length; i++) {
                         if (info.exercise === ECustomList.allowed.goals[i]) {
                              isValid = true;
                              break;
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
                    info.color = color;
                    const saveLiftOrGoalResp = await saveLiftOrGoal(currentUser.id, info);
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
// End of /user/update/liftOrGoal/:info POST

// delete user lifts & goals
server.post("/user/delete/liftOrGoal/:info", auth, async (req, res) => {
     try {

          const info = req.body.info;
          const currentUser = JSON.parse(req.headers.userinfo);

          if (currentUser.id && info.exercise && info.type === "lift" || info.type === "goal") {

               let isValid = false;

               for (let i = 0; i < ECustomList.allowed.lifts.length; i++) {
                    if (info.exercise === ECustomList.allowed.lifts[i]) {
                         isValid = true;
                    }
               }

               if (isValid === false) {
                    for (let i = 0; i < ECustomList.allowed.goals.length; i++) {
                         if (info.exercise === ECustomList.allowed.goals[i]) {
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
// End of /user/delete/liftOrGoal/:info POST

// set goal as completed and increment medals count
server.post("/user/update/goals/completed", auth, async (req, res) => {
     try {

          const completedGoalsList = req.body.completedGoalsList;
          const currentUser = JSON.parse(req.headers.userinfo);

          if (currentUser.id) {

               const completedGoalsListKeys = Object.keys(completedGoalsList);
               for (let i = 0; i < completedGoalsListKeys.length; i++) {
                    let isValid = false;
                    const current = completedGoalsListKeys[i];
                    for (let j = 0; j < ECustomList.allowed.goals.length; j++) {
                         if (current === ECustomList.allowed.goals[j]) {
                              isValid = true;
                              break;
                         }
                    }
                    if (isValid !== true) {
                         delete completedGoalsList[current];
                    }
               }

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
// End of /user/update/goals/completed POST

/// -------------------- End of Lift & Goal -------------------- ///

/// -------------------- Trainingsplit -------------------- ///

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
// End of /user/create/trainingsplit POST

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
// End of /user/delete/trainingsplit POST

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
// End of /user/save/trainingsplit POST

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
                    res.status(403).json(resp.msg).end();
               }
          } else {
               res.status(403).json("error, try again").end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});
// End of /user/get/trainingsplit POST

// get all public trainingsplits
server.post("/user/get/trainingsplit/all", auth, async (req, res) => {
     try {

          const resp = await getAllTrainingsplits();

          if (resp.status === true) {
               res.status(200).json(resp).end();
          } else {
               res.status(403).json(resp.msg).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});
// End of /user/get/trainingsplit/all POST

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
// End of /user/copy/trainingsplit POST

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
// End of /user/subunsub/trainingsplit POST

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
// End of /user/setactive/trainingsplit POST

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
// End of /user/setnotactive/trainingsplit POST

// change visibility trainingsplit
server.post("/user/change/trainingsplit/visibility", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          let value = req.body.value;

          if (!isNaN(trainingsplit_id)) {

               if (value !== true) {
                    value = false;
               }

               const resp = await changeTrainingsplitVisibility(currentUser.id, trainingsplit_id, value);

               if (resp === true) {
                    res.status(200).json(resp).end();
               } else {
                    res.status(403).json({ "status": false, "msg": `Det har oppstått en feil!` }).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});
// End of /user/change/trainingsplit/visibility POST

// add exercise to trainingsplit
server.post("/user/add/trainingsplit/exercise", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const trainingsplit_id = parseInt(req.body.trainingsplit_id);
          const exercise = req.body.exercise;
          const day = req.body.day;

          if (!isNaN(trainingsplit_id)) {

               const maxExerciseLength = 30;

               let isValid = false;
               for (let z = 0; z < ECustomList.allowed.lifts.length; z++) {
                    if (exercise.toLowerCase() === ECustomList.allowed.lifts[z]) {
                         isValid = true;
                         break;
                    }
               }

               if (exercise.length <= maxExerciseLength || isValid === true) {
                    const resp = await addExerciseTrainingsplit(currentUser.id, trainingsplit_id, exercise, day);

                    if (resp.status === true) {
                         res.status(200).json(resp.status).end();
                    } else {
                         res.status(403).json(resp).end();
                    }
               } else {
                    res.status(403).json({ "status": false, "msg": `Navnet på øvelsen kan ikke være lengre enn ${maxExerciseLength} bokstaver!` }).end();
               }
          } else {
               res.status(403).json({ "status": false, "msg": `Ugyldig trainingsplit_id!` }).end();
          }

     } catch (err) {
          console.log(err);
          res.status(403).json("invalid information").end();
     }
});
// End of /user/add/trainingsplit/exercise POST

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
// End of /user/delete/trainingsplit/exercise POST

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
// End of /user/update/trainingsplit/exercise/move POST

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
// End of /user/add/trainingsplit/exercise/row POST

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
// End of /user/delete/trainingsplit/exercise/row POST

/// -------------------- End of Trainingsplit -------------------- ///



/// -------------------- Other -------------------- ///

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
// End of /whoIsWorkingOutToday POST

// get list of users
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
// End of /users/list/all POST

// get list of leaderboards
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
// End of /users/list/all/leaderboards POST

// get list of users on specific leaderboard
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
// End of /users/list/all/leaderboards/:leaderboard POST

/// -------------------- End of Other -------------------- ///

/// -------------------- Admin -------------------- ///

// get list of pending users (requests)
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
// End of /users/list/pending POST

// accept or deny pending user
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
// End of /users/pending/:user/:acceptOrDeny POST

// give user api access
server.post("/user/giveAPIAccess", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const giveAPIUserAccess = req.body.giveAPIUserAccess;

          if (giveAPIUserAccess) {

               const resp = await giveUserAPIAccess(currentUser.id, giveAPIUserAccess);

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
// End of /user/giveAPIAccess POST

// remove user api access
server.post("/user/removeAPIAccess", auth, async (req, res) => {
     try {

          const currentUser = JSON.parse(req.headers.userinfo);
          const removeAPIAccess = req.body.removeAPIUserAccess;

          if (removeAPIAccess) {

               const resp = await removeUserAPIAccess(currentUser.id, removeAPIAccess);

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
// End of /user/removeAPIAccess POST

/// -------------------- End of Admin -------------------- ///


// -------------------------------  API Routes ---------------------- //

// get list of different api
server.get("/api", function (req, res) {

     const defaultHeaders = "content-type, uid, key";

     const resp = [
          { "url": `/getWorkoutInfo`, "method": "GET", "headers": defaultHeaders, "note": "" }, // denne brukes som eksempel i API innstillingen
          { "url": `/getTotalPB`, "method": "GET", "headers": defaultHeaders, "note": "" },
          { "url": `/getLifts/user`, "method": "GET", "headers": defaultHeaders, "note": "Brukes hovedsaklig til userlifts.html, men kan brukes i annen sammenheng." },
     ];

     res.status(200).json(resp).end();
});
// End of /api GET

// getWorkoutInfo
server.get("/getWorkoutInfo", async function (req, res) {
     try {

          const uid = req.headers.uid;
          const key = req.headers.key;

          if (uid && key) {

               const getWorkoutPlanInfo = await getWorkoutPlanAPI(uid, key);

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
});
// End of /getWorkoutInfo GET

// getTotalPB
server.get("/getTotalPB", async function (req, res) {
     try {

          const uid = req.headers.uid;
          const key = req.headers.key;

          if (uid && key) {

               const getTotalPB = await getTotalPBAPI(uid, key);

               if (getTotalPB.status === true) {

                    const resp = {
                         "user": uid,
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
// End of /getTotalPB GET

// getLifts
server.get("/getLifts/user", async function (req, res) {
     try {

          const uid = req.headers.uid;
          const key = req.headers.key;

          if (uid && key) {

               const getLifts = await getLiftsAPI(uid, key);

               if (getLifts.status === true) {

                    const resp = {
                         "userDetails": getLifts.userDetails,
                         "userLifts": getLifts.userLifts,
                         "badgeColors": ECustomList.other.badgeColors
                    }

                    res.status(200).json(resp).end();

               } else {
                    res.status(403).json(getLifts.msg).end();
               }

          } else {
               res.status(403).json(APIErrorJSON.access).end();
          }
     } catch (err) {
          console.log(err);
          res.status(403).json(APIErrorJSON.catch).end();
     }
});
// End of /getLifts/user GET

// ------------------------------- End of API Routes ---------------------- //

server.listen(server.get('port'), function () {
     console.log('Server running', server.get('port'));
});