const { response } = require("express");
const pg = require("pg");
const dbCredentials = process.env.DATABASE_URL || require("../localenv").credentials;

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

    async getListOfAllUsers() {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            // evt legge til lifts og andre ting brukeren trenger å motta
            results = await client.query('SELECT "id","username","displayname" FROM "public"."users"');
            results = (results.rows.length > 0) ? results.rows : null;
            client.end();
        } catch (err) {
            console.log(err);
        }

        return results;
    }

    //

    //  -------------------------------  get a list of all leaderboard users in application  ------------------------------- //

    async getListOfLeaderboardsUsers(numbersOnly) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            // evt legge til lifts og andre ting brukeren trenger å motta

            results = await client.query('SELECT "username","settings","lifts" FROM "public"."users"');

            let counter = 1;
            let leaderboardsCounter = 0;
            let info = {};
            let leaderboardsArr = [];

            for (let i = 0; i < results.rows.length; i++) {
                if (results.rows[i].settings.displayLeaderboards.value === true) {
                    // evt legge til løft osv?

                    let getLeaderboard = Object.keys(results.rows[i].lifts);

                    for (let j = 0; j < getLeaderboard.length; j++) {
                        if (!leaderboardsArr.includes(getLeaderboard[leaderboardsCounter]) && getLeaderboard[leaderboardsCounter]) {
                            leaderboardsArr.push(getLeaderboard[leaderboardsCounter]);
                            leaderboardsCounter++;
                        }
                    }

                    leaderboardsCounter = 0;

                    info[counter] = { "username": results.rows[i].username };
                    counter++;
                }
            }

            if (numbersOnly === true) {
                results = Object.entries(info).length;
            } else {
                results = leaderboardsArr;
            }

            client.end();
        } catch (err) {
            console.log(err);
        }

        return results;
    }

    //

    //  -------------------------------  get a info about a specific leaderboard (users and numbers)  ------------------------------- //

    async getListOfUsersLeaderboard(leaderboard) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();

            results = await client.query('SELECT "username","settings","lifts" FROM "public"."users"');

            //let counter = 1;
            //let info = {};
            let infoList = [];

            if (leaderboard === "Totalt") {

                for (let i = 0; i < results.rows.length; i++) {

                    const currentUsersLift = results.rows[i].lifts;

                    if (results.rows[i].settings.displayLeaderboards.value === true && leaderboard === "Totalt") {

                        if (currentUsersLift.Benkpress && currentUsersLift.Knebøy && currentUsersLift.Markløft) {

                            if (currentUsersLift.Benkpress.ORM !== 0 && currentUsersLift.Benkpress.ORM !== "") {
                                if (currentUsersLift.Knebøy.ORM !== 0 && currentUsersLift.Knebøy.ORM !== "") {
                                    if (currentUsersLift.Markløft.ORM !== 0 && currentUsersLift.Markløft.ORM !== "") {

                                        const totalORM = parseFloat(currentUsersLift.Benkpress.ORM) + parseFloat(currentUsersLift.Knebøy.ORM) + parseFloat(currentUsersLift.Markløft.ORM);
                                        infoList.push({ "username": results.rows[i].username, [leaderboard]: totalORM.toFixed(2) });
                                    }
                                }
                            }
                        }
                    }

                }

            } else {

                for (let i = 0; i < results.rows.length; i++) {
                    const currentUsersLift = results.rows[i].lifts;
                    if (results.rows[i].settings.displayLeaderboards.value === true && currentUsersLift[leaderboard]) {

                        if (currentUsersLift[leaderboard].ORM && currentUsersLift[leaderboard].ORM !== 0 && currentUsersLift[leaderboard].ORM !== "") {
                            //info[counter] = { "username": results.rows[i].username, [leaderboard]: results.rows[i].lifts[leaderboard].ORM };
                            infoList.push({ "username": results.rows[i].username, [leaderboard]: parseFloat(results.rows[i].lifts[leaderboard].ORM) });
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


                            const settings = {
                                "publicProfile": { "name": "Offentlig profil", "value": true },
                                "showGymCloseTime": { "name": "Vis åpningstider", "value": true },
                                "preferredColorTheme": { "name": "Utseende", "value": "auto" },
                                "displayLeaderboards": { "name": "Vis meg på ledertavler", "value": true },
                                "displayWorkoutList": { "name": "Vis meg på 'hvem som trener i dag listen'", "value": true },
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
                            const info = { "age": 0, "height": 0, "weight": 0 };

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

    async getUserDetails(viewingUser, username) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let userDetails = {};

        try {
            await client.connect();

            results = await client.query('SELECT "settings" FROM "users" WHERE username=$1', [viewingUser]);

            if (results.rows[0] !== undefined) {

                //if owner then access anyways
                if (results.rows[0].settings.publicProfile.value === true || viewingUser === username) {
                    if (viewingUser === username) {
                        results = await client.query('SELECT "id","username","displayname","settings","trainingsplit","lifts","goals","info","isadmin" FROM "users" WHERE username=$1', [username]);

                        if (results.rows[0]) {
                            results = results.rows[0];

                            const hasAccessToApi = await client.query('SELECT "key" FROM "api_keys" WHERE username=$1', [username]);

                            if (hasAccessToApi.rows[0] !== undefined) {
                                results.apikey = hasAccessToApi.rows[0].key;
                            }
                        }

                    } else {
                        results = await client.query('SELECT "username","displayname","trainingsplit","lifts","goals","info" FROM "users" WHERE username=$1', [viewingUser]);
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

        return { "status": results, "userDetails": userDetails };
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

            newSettings[setting].value = value;

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

            results = await client.query('SELECT "username","displayname","settings","trainingsplit" FROM "users"');

            //let counter = 0;

            for (let i = 0; i < results.rows.length; i++) {
                const todaysWorkout = results.rows[i].trainingsplit[dayTxt];
                if (results.rows[i].settings.displayWorkoutList.value === true && todaysWorkout.length > 0 && todaysWorkout !== "Fri") {
                    //info[counter] = { "username": results.rows[i].username, "userFullName": results.rows[i].displayname, "todaysWorkout": todaysWorkout };
                    //counter++;
                    infoList.push({ "username": results.rows[i].username, "userFullName": results.rows[i].displayname, "todaysWorkout": todaysWorkout });
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
                    const userHasPublicProfile = results.rows[0].settings.publicProfile.value

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

    //
}

module.exports = new StorageHandler(dbCredentials);