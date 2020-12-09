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
            results = await client.query('SELECT "id","username","displayname" FROM "public"."users" WHERE username=$1 AND password=$2', [username, password]);
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
}

module.exports = new StorageHandler(dbCredentials);