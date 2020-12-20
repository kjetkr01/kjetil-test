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
            results = await client.query('SELECT username from "pending_users" where username=$1', [username]);

            if (results.rows.length === 0) {

                // checks if username is already taken in users table
                results = await client.query('SELECT username from "users" where username=$1', [username]);

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
            results = await client.query('SELECT "id","username","password","displayname" FROM "public"."users" WHERE username=$1 AND password=$2', [username, password]);
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

    //  -------------------------------  get a list of all pending users in application  ------------------------------- //

    async getListOfPendingUsers(username, onlyNumbers) {

        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();

            results = await client.query('SELECT username from "users" where username=$1 AND isadmin=true', [username]);

            if (results.rows.length !== 0) {

                if (onlyNumbers === true) {
                    results = await client.query('SELECT "id" FROM "public"."pending_users"');
                } else {
                    results = await client.query('SELECT "id","username","displayname" FROM "public"."pending_users"');
                }

                results = (results.rows.length > 0) ? results.rows : null;
                client.end();

            } else {

                results = null;
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

            results = await client.query('SELECT username from "users" where username=$1 AND isadmin=true', [username]);

            if (results.rows.length !== 0) {

                results = await client.query('SELECT username from "users" where username=$1', [pendingUser]);

                if (results.rows.length === 0) {

                    const newUser = await client.query('SELECT * from "pending_users" where username=$1', [pendingUser]);

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
                                "leaderboards": true,
                                "publicProfile": true,
                                "showGymCloseTime": true,
                                "extraStats": false,
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
                            const info = { "age": "", "height": "", "weight": "" };

                            await client.query('INSERT INTO "public"."users"("username", "password", "displayname", "settings", "trainingsplit", "lifts", "goals", "info", "isadmin") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;', [newUserUsername, newUserPassword, newUserDisplayname, settings, trainingSplit, lifts, goals, info, false]);
                            results = true;
                        }

                    } else {
                        results = true;
                    }

                    if (results) {
                        await client.query('DELETE from "pending_users" where username=$1', [pendingUser]);
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

            results = await client.query('SELECT trainingsplit from "users" where username=$1', [username]);

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

    async getUserDetails(viewingUser) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let userDetails = {};

        try {
            await client.connect();

            results = await client.query('SELECT settings from "users" where username=$1', [viewingUser]);

            if (results.rows[0] !== undefined) {

                if (results.rows[0].settings.publicProfile === true) {
                    results = await client.query('SELECT "username","displayname","trainingsplit","lifts","goals","info","isadmin" from "users" where username=$1', [viewingUser]);
                    userDetails = results.rows[0];
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

    //  -------------------------------  login / validate userinfo from token (refresh token)  ------------------------------- //

    async validateUserInfoFromToken(username, password) {
        const client = new pg.Client(this.credentials);
        let results = false;
        try {
            await client.connect();
            results = await client.query('SELECT "id","username","password","displayname" FROM "public"."users" WHERE username=$1 AND password=$2', [username, password]);
            results = (results.rows.length > 0) ? results.rows[0] : false;
            client.end();
        } catch (err) {
            console.log(err);
        }

        return results;
    }

    //
}

module.exports = new StorageHandler(dbCredentials);