const pg = require("pg");
const dbCredentials = process.env.DATABASE_URL || require("../localenv").credentials;
const allowedLifts = require("../arrayLists").allowedLifts;
const allowedGoals = require("../arrayLists").allowedGoals;
const badgeColors = require("../arrayLists").badgeColors;

class StorageHandler {

    constructor(credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    //  -------------------------------  ask for access / create new user  ------------------------------- //

    async addUserToPendingList(username, password, displayname) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();

            // checks if username is already taken in pending_users table
            results = await client.query('SELECT "username" FROM "pending_users" WHERE username=$1', [username]);

            if (results.rows.length === 0) {

                // checks if username is already taken in users table
                results = await client.query('SELECT "username" FROM "users" WHERE username=$1', [username]);

                if (results.rows.length === 0) {

                    results = await client.query('INSERT INTO "public"."pending_users"("username", "password", "displayname") VALUES($1, $2, $3) RETURNING *;', [username, password, displayname]);
                    results = results.rows[0];
                    client.end();

                } else {
                    results = null;
                    client.end();
                }

            } else {
                results = null;
                client.end();
            }

        } catch (err) {
            console.log(err);
            results = err;
            client.end();
        }

        return results;
    }

    //



    //  -------------------------------  login / validate userinfo  ------------------------------- //

    async validateUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            // evt legge til lifts og andre ting brukeren trenger å motta
            results = await client.query('SELECT "id","username","password","displayname","settings" FROM "public"."users" WHERE username=$1 AND password=$2', [username, password]);
            results = (results.rows.length > 0) ? results.rows[0] : null;
            client.end();
        } catch (err) {
            console.log(err);
        }

        return results;
    }

    //


    //  -------------------------------  get a list of all users in application  ------------------------------- //

    async getListOfAllUsers(username) {
        const client = new pg.Client(this.credentials);
        let results = false;
        let allUsers = null;
        let allAPIUsers;
        try {
            await client.connect();
            // evt legge til lifts og andre ting brukeren trenger å motta

            const checkIfAdmin = await client.query('SELECT "username" FROM "users" WHERE username=$1 AND isadmin=true', [username]);

            if (checkIfAdmin.rows.length !== 0) {
                allAPIUsers = await client.query('SELECT "username" FROM "public"."api_keys"');
                allAPIUsers = allAPIUsers.rows;

                allUsers = await client.query('SELECT "id","username","displayname" FROM "public"."users"');
                allUsers = allUsers.rows;
                results = true;
            } else {
                results = false;
            }

            client.end();
        } catch (err) {
            console.log(err);
        }

        return { "status": results, "allUsers": allUsers, "allAPIUsers": allAPIUsers };
    }

    //

    //  -------------------------------  get a list of all leaderboards in application  ------------------------------- //

    async getListOfLeaderboards() {
        const client = new pg.Client(this.credentials);
        let results = false;

        let leaderboards = {};

        try {
            await client.connect();
            results = await client.query('SELECT "username","settings","lifts" FROM "public"."users"');

            for (let i = 0; i < results.rows.length; i++) {
                if (results.rows[i].settings.displayLeaderboards === true) {

                    const getLeaderboard = Object.keys(results.rows[i].lifts);

                    if (getLeaderboard.includes("Benkpress") && getLeaderboard.includes("Knebøy") && getLeaderboard.includes("Markløft")) {
                        const updateNumber = parseInt(leaderboards["Totalt"]) || 0;
                        leaderboards["Totalt"] = updateNumber + 1;
                    }

                    for (let j = 0; j < getLeaderboard.length; j++) {
                        const isAllowedLift = allowedLifts.includes(getLeaderboard[j]);

                        if (isAllowedLift === true) {

                            const updateNumber = parseInt(leaderboards[getLeaderboard[j]]) || 0;
                            leaderboards[getLeaderboard[j]] = updateNumber + 1;
                        }
                    }
                }
            }

            results = true;

            client.end();
        } catch (err) {
            console.log(err);
        }

        return { "leaderboards": leaderboards, "status": results };
    }

    //

    //  -------------------------------  get a info about a specific leaderboard (users and numbers)  ------------------------------- //

    async getListOfUsersLeaderboard(leaderboard) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();

            results = await client.query('SELECT "id","username","settings","lifts" FROM "public"."users"');

            //let counter = 1;
            //let info = {};
            let infoList = [];

            if (leaderboard === "Totalt") {

                for (let i = 0; i < results.rows.length; i++) {

                    const currentUsersLift = results.rows[i].lifts;

                    if (results.rows[i].settings.displayLeaderboards === true && leaderboard === "Totalt") {

                        if (currentUsersLift.Benkpress && currentUsersLift.Knebøy && currentUsersLift.Markløft) {

                            if (currentUsersLift.Benkpress.ORM !== 0 && currentUsersLift.Benkpress.ORM !== "") {
                                if (currentUsersLift.Knebøy.ORM !== 0 && currentUsersLift.Knebøy.ORM !== "") {
                                    if (currentUsersLift.Markløft.ORM !== 0 && currentUsersLift.Markløft.ORM !== "") {

                                        const totalORM = parseFloat(currentUsersLift.Benkpress.ORM) + parseFloat(currentUsersLift.Knebøy.ORM) + parseFloat(currentUsersLift.Markløft.ORM);
                                        infoList.push({ "id": results.rows[i].id, "username": results.rows[i].username, [leaderboard]: totalORM.toFixed(2) });
                                    }
                                }
                            }
                        }
                    }

                }

            } else {

                for (let i = 0; i < results.rows.length; i++) {
                    const currentUsersLift = results.rows[i].lifts;
                    if (results.rows[i].settings.displayLeaderboards === true && currentUsersLift[leaderboard]) {

                        if (currentUsersLift[leaderboard].ORM && currentUsersLift[leaderboard].ORM !== 0 && currentUsersLift[leaderboard].ORM !== "") {
                            //info[counter] = { "username": results.rows[i].username, [leaderboard]: results.rows[i].lifts[leaderboard].ORM };
                            infoList.push({ "id": results.rows[i].id, "username": results.rows[i].username, [leaderboard]: parseFloat(results.rows[i].lifts[leaderboard].ORM) });
                            //counter++;
                        }

                    }

                }
            }

            //results = info;
            results = infoList;

            client.end();
        } catch (err) {
            console.log(err);
        }

        return results;
    }

    //

    //  -------------------------------  get a list of all pending users in application  ------------------------------- //

    async getListOfPendingUsers(username, onlyNumbers) {

        const client = new pg.Client(this.credentials);
        let results = false;
        try {
            await client.connect();

            results = await client.query('SELECT "username" FROM "users" WHERE username=$1 AND isadmin=true', [username]);

            if (results.rows.length !== 0) {

                if (onlyNumbers === true) {
                    results = await client.query('SELECT "id" FROM "public"."pending_users"');
                } else {
                    results = await client.query('SELECT "id","username","displayname" FROM "public"."pending_users"');
                }

                results = (results.rows.length > 0) ? results.rows : true;
                client.end();

            } else {

                results = false;
                client.end();

            }

        } catch (err) {
            console.log(err);
        }

        return results;
    }

    //

    //  -------------------------------  accept or deny pending user  ------------------------------- //

    async acceptOrDenyUser(username, pendingUser, acceptOrDeny) {

        const client = new pg.Client(this.credentials);
        let results = false;
        try {
            await client.connect();

            results = await client.query('SELECT "username" FROM "users" WHERE username=$1 AND isadmin=true', [username]);

            if (results.rows.length !== 0) {

                results = await client.query('SELECT "username" FROM "users" WHERE username=$1', [pendingUser]);

                if (results.rows.length === 0) {

                    const newUser = await client.query('SELECT * FROM "pending_users" WHERE username=$1', [pendingUser]);

                    if (newUser.rows[0] === undefined) {
                        results = false;
                        return results;
                    }

                    if (acceptOrDeny) {

                        const newUserUsername = newUser.rows[0].username;
                        const newUserPassword = newUser.rows[0].password;
                        const newUserDisplayname = newUser.rows[0].displayname;

                        if (newUserUsername && newUserPassword && newUserDisplayname) {


                            // endre slik at kun value ? feks "publicProfile: true"
                            const settings = {
                                "publicProfile": true,
                                "displayLeaderboards": true,
                                "displayWorkoutList": true,
                                "preferredTheme": 0,
                                "preferredColorTheme": 0,
                                "badgeSize": 0,
                                "badgeDetails": 0,
                            };

                            const trainingSplit = {
                                "Mandag": "",
                                "Tirsdag": "",
                                "Onsdag": "",
                                "Torsdag": "",
                                "Fredag": "",
                                "Lørdag": "",
                                "Søndag": ""
                            };

                            const lifts = {};
                            const goals = {};
                            const info = { "height": 0, "age": 0, "weight": 0, "gym": "" };

                            await client.query('INSERT INTO "public"."users"("username", "password", "displayname", "settings", "trainingsplit", "lifts", "goals", "info", "isadmin") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', [newUserUsername, newUserPassword, newUserDisplayname, settings, trainingSplit, lifts, goals, info, false]);
                            results = true;
                        }

                    } else {
                        results = true;
                    }

                    if (results) {
                        await client.query('DELETE FROM "pending_users" WHERE username=$1', [pendingUser]);
                    }

                }

                client.end();

            } else {

                results = false;
                client.end();

            }

        } catch (err) {
            console.log(err);
        }

        client.end();

        return results;
    }

    //


    //  -------------------------------  get workoutSplit (user)  ------------------------------- //

    async getWorkoutSplit(username) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let program = {};

        try {
            await client.connect();

            results = await client.query('SELECT "trainingsplit" FROM "users" WHERE username=$1', [username]);

            if (results.rows[0] !== undefined) {
                program = results.rows[0].trainingsplit;
                results = true;
                client.end();
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "program": program };
    }

    //

    //  -------------------------------  get userdetails (view userPage)  ------------------------------- //

    async getUserDetails(viewingUser, userID) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let userDetails = {};
        let username = null;

        try {
            await client.connect();

            results = await client.query('SELECT "username","settings" FROM "users" WHERE id=$1', [viewingUser]);
            username = results.rows[0].username;

            if (results.rows[0] !== undefined) {

                //if owner then access anyways
                if (results.rows[0].settings.publicProfile === true || viewingUser === userID) {
                    if (viewingUser === userID) {
                        results = await client.query('SELECT "id","username","displayname","settings","trainingsplit","lifts","goals","info","isadmin" FROM "users" WHERE id=$1', [userID]);

                        if (results.rows[0]) {
                            results = results.rows[0];
                            const username = results.username;

                            const hasAccessToApi = await client.query('SELECT "key" FROM "api_keys" WHERE username=$1', [username]);

                            const liftsLeft = [];
                            const goalsLeft = [];

                            const liftKeys = Object.keys(results.lifts);

                            for (let i = 0; i < allowedLifts.length; i++) {
                                if (liftKeys.includes(allowedLifts[i])) {
                                } else {
                                    liftsLeft.push(allowedLifts[i]);
                                }
                            }

                            const goalKeys = Object.keys(results.goals);

                            for (let i = 0; i < allowedGoals.length; i++) {
                                if (goalKeys.includes(allowedGoals[i])) {
                                } else {
                                    goalsLeft.push(allowedGoals[i]);
                                }
                            }

                            results.liftsLeft = liftsLeft;
                            results.goalsLeft = goalsLeft;

                            if (hasAccessToApi.rows[0] !== undefined) {
                                results.apikey = hasAccessToApi.rows[0].key;
                            }

                            results.badgeColors = badgeColors;
                        }

                    } else {
                        results = await client.query('SELECT "username","displayname","trainingsplit","lifts","goals","info" FROM "users" WHERE id=$1', [viewingUser]);
                        results = results.rows[0];
                    }
                    userDetails = results;
                    results = true;
                } else {
                    results = true;
                    userDetails = false;
                }

                client.end();
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return { "status": results, "userDetails": userDetails, "username": username };
    }

    //

    //  -------------------------------  get userdetails (private settings page)  ------------------------------- //

    async getUserSettingsAndInfo(username) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let userDetails = {};

        try {
            await client.connect();

            results = await client.query('SELECT "id","username","displayname","settings" FROM "users" WHERE username=$1', [username]);
            userDetails = results.rows[0];
            results = true;

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return { "status": results, "userDetails": userDetails };
    }

    //

    //  -------------------------------  update userdetails (private settings page)  ------------------------------- //

    async updateUserSetting(username, setting, value) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            results = await client.query('SELECT "settings" FROM "users" WHERE username=$1', [username]);

            const newSettings = results.rows[0].settings;

            newSettings[setting] = value;

            await client.query('UPDATE "users" SET settings=$1 WHERE username=$2', [newSettings, username]);

            results = true;

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return results;
    }

    //

    //  -------------------------------  get list of all public users that are working out today  ------------------------------- //

    async getListOfAllUsersWorkoutToday(dayTxt) {

        const client = new pg.Client(this.credentials);
        let results = false;
        //let info = {};
        let infoList = [];

        try {
            await client.connect();

            results = await client.query('SELECT "id","displayname","settings","trainingsplit" FROM "users"');

            //let counter = 0;

            for (let i = 0; i < results.rows.length; i++) {
                const todaysWorkout = results.rows[i].trainingsplit[dayTxt];
                if (todaysWorkout) {
                    if (results.rows[i].settings.displayWorkoutList === true && todaysWorkout.length > 0 && todaysWorkout !== "Fri") {
                        //info[counter] = { "username": results.rows[i].username, "userFullName": results.rows[i].displayname, "todaysWorkout": todaysWorkout };
                        //counter++;
                        infoList.push({ "id": results.rows[i].id, "userFullName": results.rows[i].displayname, "todaysWorkout": todaysWorkout });
                    }
                }
            }

            results = true;

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return { "status": results, "info": infoList };
    }

    //

    //  -------------------------------  save/update lift or goal  ------------------------------- //

    async saveLiftOrGoal(username, exercise, kg, date, type, color) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            if (type === "lift") {

                results = await client.query('SELECT "lifts" FROM "users" WHERE username=$1', [username]);

                const updatedLifts = results.rows[0].lifts;
                updatedLifts[exercise] = { "ORM": kg, "PRdate": date, "color": color };

                await client.query('UPDATE "users" SET lifts=$1 WHERE username=$2', [updatedLifts, username]);

                results = true;

            } else if (type === "goal") {

                results = await client.query('SELECT "goals" FROM "users" WHERE username=$1', [username]);

                const updatedGoals = results.rows[0].goals;

                updatedGoals[exercise] = { "goal": kg, "Goaldate": date, "color": color };

                await client.query('UPDATE "users" SET goals=$1 WHERE username=$2', [updatedGoals, username]);

                results = true;

            }

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return results;
    }

    //

    //  -------------------------------  delete lift or goal  ------------------------------- //

    async deleteLiftOrGoal(username, exercise, type) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            if (type === "lift") {

                results = await client.query('SELECT "lifts" FROM "users" WHERE username=$1', [username]);

                const updatedLifts = results.rows[0].lifts;
                delete updatedLifts[exercise];

                await client.query('UPDATE "users" SET lifts=$1 WHERE username=$2', [updatedLifts, username]);

                results = true;

            } else if (type === "goal") {

                results = await client.query('SELECT "goals" FROM "users" WHERE username=$1', [username]);

                const updatedGoals = results.rows[0].goals;
                delete updatedGoals[exercise];

                await client.query('UPDATE "users" SET goals=$1 WHERE username=$2', [updatedGoals, username]);

                results = true;

            }


            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return results;
    }

    //

    //  -------------------------------  update trainingDays (user)  ------------------------------- //

    async updateTrainingDays(trainingDays, username) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            const updatedTrainingDays = {};

            if (trainingDays[0] !== "none") {

                let checkTrainingDays = await client.query('SELECT trainingsplit FROM users WHERE username=$1', [username]);
                checkTrainingDays = checkTrainingDays.rows[0].trainingsplit;
                const trainingDaysKeys = Object.keys(checkTrainingDays);

                for (let i = 0; i < trainingDays.length; i++) {
                    if (trainingDaysKeys.includes(trainingDays[i])) {
                        updatedTrainingDays[trainingDays[i]] = checkTrainingDays[trainingDays[i]];
                    } else {
                        updatedTrainingDays[trainingDays[i]] = "";
                    }

                }
            }

            await client.query('UPDATE "users" SET trainingsplit=$1 WHERE username=$2', [updatedTrainingDays, username]);

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }

    //

    // api only calls

    //  -------------------------------  getWorkoutPlanAPI  ------------------------------- //

    async getWorkoutPlanAPI(user, key) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let isOwner = false;
        let info = {};

        try {
            await client.connect();

            results = await client.query('SELECT "username" FROM "api_keys" WHERE key=$1', [key]);

            if (results.rows.length === 0) {

                results = false;

            } else {

                if (results.rows[0].username === user) {
                    isOwner = true;
                }

                results = await client.query('SELECT "settings" FROM "users" WHERE username=$1', [user]);

                if (results.rows.length === 0) {
                    results = false;
                } else {
                    const userHasPublicProfile = results.rows[0].settings.publicProfile;

                    if (userHasPublicProfile === true || isOwner === true) {
                        results = await client.query('SELECT "trainingsplit","displayname" FROM "users" WHERE username=$1', [user]);

                        if (results.rows.length === 0) {
                            results = false;
                        } else {
                            info = results.rows[0]
                            results = true;
                        }

                    } else {
                        results = false;
                    }

                }

            }

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return { "status": results, "info": info, "isOwner": isOwner };
    }

    //


    //  -------------------------------  getTotalPBAPI  ------------------------------- //

    async getTotalPBAPI(user, key) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let isOwner = false;
        let info = {};

        try {
            await client.connect();

            results = await client.query('SELECT "username" FROM "api_keys" WHERE key=$1', [key]);

            if (results.rows.length === 0) {

                results = false;

            } else {

                if (results.rows[0].username === user) {
                    isOwner = true;
                }

                results = await client.query('SELECT "settings" FROM "users" WHERE username=$1', [user]);

                if (results.rows.length === 0) {
                    results = false;
                } else {
                    const userHasPublicProfile = results.rows[0].settings.publicProfile;

                    if (userHasPublicProfile === true || isOwner === true) {
                        results = await client.query('SELECT "lifts","displayname" FROM "users" WHERE username=$1', [user]);

                        if (results.rows.length === 0) {
                            results = false;
                        } else {

                            info = results.rows[0];

                            if (info.lifts.hasOwnProperty("Benkpress") && info.lifts.hasOwnProperty("Knebøy") && info.lifts.hasOwnProperty("Markløft")) {

                                const currentUsersLift = results.rows[0].lifts;

                                if (currentUsersLift.Benkpress.ORM !== 0 && currentUsersLift.Benkpress.ORM !== "") {
                                    if (currentUsersLift.Knebøy.ORM !== 0 && currentUsersLift.Knebøy.ORM !== "") {
                                        if (currentUsersLift.Markløft.ORM !== 0 && currentUsersLift.Markløft.ORM !== "") {

                                            const totalORMKG = parseFloat(currentUsersLift.Benkpress.ORM) + parseFloat(currentUsersLift.Knebøy.ORM) + parseFloat(currentUsersLift.Markløft.ORM);
                                            const totalORMLBS = totalORMKG * 2.20462262;
                                            info.kg = totalORMKG.toFixed(2);
                                            info.lbs = totalORMLBS.toFixed(2);
                                            results = true;
                                        }
                                    }
                                }

                            } else {
                                info = {};
                                results = false;
                            }
                        }

                    } else {
                        results = false;
                    }

                }

            }

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return { "status": results, "info": info, "isOwner": isOwner };
    }

    //

    //
}

module.exports = new StorageHandler(dbCredentials);