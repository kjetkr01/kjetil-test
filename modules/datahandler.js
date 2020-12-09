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

    //  -------------------------------  create new user  ------------------------------- //

    async addUserToPendingList(username, password, displayname) {
        const client = new pg.Client(this.credentials);
        let results = null;
        try {
            await client.connect();
            results = await client.query('SELECT username from "pending_users" where username=$1', [username]);

            if (results.rows.length === 0) {
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
}

//

module.exports = new StorageHandler(dbCredentials);