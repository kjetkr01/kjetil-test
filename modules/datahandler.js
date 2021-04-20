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
            results = await client.query(`
            SELECT username
            FROM pending_users
            WHERE username=$1`,
                [username]);

            if (results.rows.length === 0) {

                // checks if username is already taken in users table
                results = await client.query(`
                SELECT username
                FROM users
                WHERE username=$1`,
                    [username]);

                const requestDate = new Date().toISOString().substr(0, 10) || null;

                if (results.rows.length === 0) {

                    results = await client.query(`
                    INSERT INTO pending_users(username, password, displayname, request_date)
                    VALUES($1, $2, $3, $4) RETURNING *;`,
                        [username, password, displayname, requestDate]);

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

            results = await client.query(`
            SELECT users.id, users.username, users.password, users.displayname, user_settings.*
            FROM users, user_settings
            WHERE users.username = $1
            AND users.password = $2
            AND users.id = user_settings.user_id`,
                [username, password]);

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
        let allAPIUsers = null;
        try {
            await client.connect();
            // evt legge til lifts og andre ting brukeren trenger å motta

            const checkIfAdmin = await client.query(`
            SELECT username
            FROM users
            WHERE username = $1
            AND isadmin = true`,
                [username]);

            if (checkIfAdmin.rows.length !== 0) {
                allAPIUsers = await client.query(`
                SELECT user_id
                FROM user_api
                WHERE user_api.apikey IS NOT null`);

                allAPIUsers = allAPIUsers.rows;

                allUsers = await client.query(`
                SELECT users.id, users.username, users.displayname, user_settings.*
                FROM users, user_settings
                WHERE users.id = user_settings.user_id`);

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

            results = await client.query(`
            SELECT user_lifts.*
            FROM users, user_settings, user_lifts
            WHERE users.id = user_settings.user_id
            AND user_settings.displayleaderboards = true
            AND users.id = user_lifts.user_id
            `);

            const leaderboardLifts = results.rows;

            for (let i = 0; i < leaderboardLifts.length; i++) {

                const lifts = leaderboardLifts[i];
                delete lifts.user_id;
                const liftKeys = Object.keys(lifts);

                if (liftKeys.includes("benkpress") && liftKeys.includes("knebøy") && liftKeys.includes("markløft")) {
                    if (Object.entries(lifts.benkpress).length > 0 && Object.entries(lifts.knebøy).length > 0 && Object.entries(lifts.markløft).length > 0) {
                        const updateNumber = parseInt(leaderboards["totalt"]) || 0;
                        leaderboards["totalt"] = updateNumber + 1;
                    }
                }

                for (let j = 0; j < liftKeys.length; j++) {
                    if (allowedLifts.includes(liftKeys[j])) {
                        if (Object.entries(lifts[liftKeys[j]]).length > 0) {
                            const updateNumber = parseInt(lifts[liftKeys[j]]) || 0;
                            leaderboards[liftKeys[j]] = updateNumber + 1;
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
        const infoList = [];
        const reps = "1"; // kan evt endre utfra hva brukeren spør om?
        try {
            await client.connect();

            if (allowedLifts.includes(leaderboard) || leaderboard === "totalt") {

                if (leaderboard === "totalt") {

                    if (reps === "1") {

                        results = await client.query(`
                        SELECT users.id, users.username, user_lifts.benkpress, user_lifts.knebøy, user_lifts.markløft
                        FROM users, user_settings, user_lifts
                        WHERE users.id = user_settings.user_id
                        AND user_settings.displayleaderboards = true
                        AND users.id = user_lifts.user_id`);

                        for (let i = 0; i < results.rows.length; i++) {

                            const currentUser = results.rows[i];
                            const id = currentUser.id;
                            const username = currentUser.username;

                            let benkpressKG = 0;
                            let knebøyKG = 0;
                            let markløftKG = 0;
                            const reps = "1";

                            const benkpressLifts = currentUser.benkpress;
                            const benkpressLiftsKeys = Object.keys(benkpressLifts);
                            for (let i = 0; i < benkpressLiftsKeys.length; i++) {

                                const liftIndex = benkpressLifts[benkpressLiftsKeys[i]];

                                if (liftIndex.reps === reps) {
                                    if (liftIndex.kg && liftIndex.kg !== 0 && liftIndex.kg !== "0") {
                                        const currentKG = parseFloat(liftIndex.kg);
                                        if (currentKG > benkpressKG) {
                                            benkpressKG = currentKG;
                                        }
                                    }
                                }
                            }

                            if (benkpressKG > 0) {

                                const knebøyLifts = currentUser.knebøy;
                                const knebøyLiftsKeys = Object.keys(knebøyLifts);
                                for (let i = 0; i < knebøyLiftsKeys.length; i++) {

                                    const liftIndex = knebøyLifts[knebøyLiftsKeys[i]];

                                    if (liftIndex.reps === reps) {
                                        if (liftIndex.kg && liftIndex.kg !== 0 && liftIndex.kg !== "0") {
                                            const currentKG = parseFloat(liftIndex.kg);
                                            if (currentKG > knebøyKG) {
                                                knebøyKG = currentKG;
                                            }
                                        }
                                    }
                                }

                                if (knebøyKG > 0) {

                                    const markløftLifts = currentUser.markløft;
                                    const markløftLiftsKeys = Object.keys(markløftLifts);
                                    for (let i = 0; i < markløftLiftsKeys.length; i++) {

                                        const liftIndex = markløftLifts[markløftLiftsKeys[i]];

                                        if (liftIndex.reps === reps) {
                                            if (liftIndex.kg && liftIndex.kg !== 0 && liftIndex.kg !== "0") {
                                                const currentKG = parseFloat(liftIndex.kg);
                                                if (currentKG > markløftKG) {
                                                    markløftKG = currentKG;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if (benkpressKG > 0 && knebøyKG > 0 && markløftKG > 0) {
                                const calcTotal = benkpressKG + knebøyKG + markløftKG;
                                infoList.push({ "id": id, "username": username, [leaderboard]: calcTotal.toFixed(2) });
                            }

                        }
                    }

                } else {

                    results = await client.query(`
                    SELECT users.id, users.username, user_lifts.${leaderboard}
                    FROM users, user_settings, user_lifts
                    WHERE users.id = user_settings.user_id
                    AND user_settings.displayleaderboards = true
                    AND users.id = user_lifts.user_id`);

                    for (let i = 0; i < results.rows.length; i++) {

                        const currentUser = results.rows[i];
                        const id = currentUser.id;
                        const username = currentUser.username;

                        const exerciseLifts = currentUser[leaderboard];
                        const exerciseLiftsKeys = Object.keys(exerciseLifts);
                        let highestKG = 0;

                        for (let i = 0; i < exerciseLiftsKeys.length; i++) {
                            const liftIndex = exerciseLifts[exerciseLiftsKeys[i]];
                            if (liftIndex.reps === reps) {
                                if (liftIndex.kg && liftIndex.kg !== 0 && liftIndex.kg !== "0") {
                                    const currentKG = parseFloat(liftIndex.kg);

                                    if (currentKG > highestKG) {
                                        highestKG = currentKG;
                                    }
                                }
                            }
                        }

                        if (highestKG > 0) {
                            infoList.push({ "id": id, "username": username, [leaderboard]: highestKG });
                        }
                    }
                }

                results = infoList;
            }

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

            results = await client.query(`
            SELECT username
            FROM users
            WHERE username = $1
            AND isadmin = true`, [username]);

            if (results.rows.length !== 0) {

                if (onlyNumbers === true) {
                    results = await client.query(`
                    SELECT id
                    FROM pending_users`);
                } else {
                    results = await client.query(`
                    SELECT id, username, displayname, request_date
                    FROM pending_users`);
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

            results = await client.query(`
            SELECT username
            FROM users
            WHERE username = $1
            AND isadmin = true`,
                [username]);

            if (results.rows.length !== 0) {

                results = await client.query(`
                SELECT username
                FROM users
                WHERE username = $1`,
                    [pendingUser]);

                if (results.rows.length === 0) {

                    const newUser = await client.query(`
                    SELECT *
                    FROM pending_users
                    WHERE username = $1`,
                        [pendingUser]);

                    if (newUser.rows[0] === undefined) {
                        results = false;
                        return results;
                    }

                    if (acceptOrDeny) {

                        const newUserUsername = newUser.rows[0].username;
                        const newUserPassword = newUser.rows[0].password;
                        const newUserDisplayname = newUser.rows[0].displayname;
                        const newUserMemberSince = new Date().toISOString().substr(0, 10) || null;

                        if (newUserUsername && newUserPassword && newUserDisplayname) {

                            results = await client.query(`
                            INSERT INTO users(username, password, displayname, member_since)
                            VALUES($1, $2, $3, $4)
                            RETURNING id`,
                                [newUserUsername, newUserPassword, newUserDisplayname, newUserMemberSince]);

                            const id = results.rows[0].id;
                            await client.query(`
                            INSERT INTO user_settings(user_id)
                            VALUES($1)`,
                                [id]);

                            await client.query(`
                            INSERT INTO user_lifts(user_id)
                            VALUES($1)`,
                                [id]);

                            await client.query(`
                            INSERT INTO user_goals(user_id)
                            VALUES($1)`,
                                [id]);

                            await client.query(`
                            INSERT INTO user_details(user_id)
                            VALUES($1)`,
                                [id]);

                            await client.query(`
                            INSERT INTO user_api(user_id)
                            VALUES($1)`,
                                [id]);

                            results = true;
                        }

                    } else {
                        results = true;
                    }

                    if (results) {
                        await client.query(`
                        DELETE FROM pending_users
                        WHERE username = $1`,
                            [pendingUser]);

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

            results = await client.query(`
            SELECT *
            FROM users, user_trainingsplit
            WHERE users.username = $1
            AND users.id = user_trainingsplit.user_id
            `,
                [username]);

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

        let userCacheObj = {};

        try {
            await client.connect();

            results = await client.query(`
            SELECT users.username, user_settings.publicprofile
            FROM users, user_settings
            WHERE users.id=$1
            AND users.id = user_settings.user_id`,
                [viewingUser]);

            username = results.rows[0].username;

            if (results.rows[0] !== undefined) {
                results = results.rows[0];

                let isAdmin = await client.query(`
                SELECT users.isadmin
                FROM users
                WHERE users.id=$1`,
                    [userID]);

                isAdmin = isAdmin.rows[0].isadmin || false;

                //const isAdmin = results.isadmin;
                const publicProfile = results.publicprofile;
                //if owner then access anyways / admins get access anyways
                if (publicProfile === true || viewingUser === userID || isAdmin === true) {
                    if (viewingUser === userID) {
                        results = await client.query(`
                        SELECT users.id, users.username, users.displayname, users.member_since, users.isadmin
                        FROM users
                        WHERE users.id=$1`,
                            [userID]);

                        userCacheObj = results.rows[0];

                        results = await client.query(`
                        SELECT user_settings.*
                        FROM users, user_settings
                        WHERE users.id = $1
                        AND users.id = user_settings.user_id`,
                            [userID]);

                        delete results.rows[0].user_id;
                        userCacheObj.settings = results.rows[0];

                        results = await client.query(`
                        SELECT user_details.*
                        FROM users, user_details
                        WHERE users.id = $1
                        AND users.id = user_details.user_id`,
                            [userID]);

                        delete results.rows[0].user_id;
                        userCacheObj.info = results.rows[0];

                        results = await client.query(`
                        SELECT user_lifts.*
                        FROM users, user_lifts
                        WHERE users.id = $1
                        AND users.id = user_lifts.user_id`,
                            [userID]);

                        delete results.rows[0].user_id;
                        userCacheObj.lifts = results.rows[0];

                        results = await client.query(`
                        SELECT user_goals.*
                        FROM users, user_goals
                        WHERE users.id = $1
                        AND users.id = user_goals.user_id`,
                            [userID]);

                        delete results.rows[0].user_id;
                        userCacheObj.goals = results.rows[0];

                        const userIDReq = userCacheObj.id;

                        const hasAccessToApi = await client.query(`
                            SELECT apikey
                            FROM users, user_api
                            WHERE users.id = $1
                            AND users.id = user_api.user_id
                            AND apikey IS NOT null`,
                            [userIDReq]);

                        const liftsLeft = [];
                        const goalsLeft = [];

                        const liftKeys = Object.keys(userCacheObj.lifts);

                        for (let i = 0; i < allowedLifts.length; i++) {
                            if (liftKeys.includes(allowedLifts[i])) {
                            } else {
                                liftsLeft.push(allowedLifts[i]);
                            }
                        }

                        const goalKeys = Object.keys(userCacheObj.goals);

                        for (let i = 0; i < allowedGoals.length; i++) {
                            if (goalKeys.includes(allowedGoals[i])) {
                            } else {
                                goalsLeft.push(allowedGoals[i]);
                            }
                        }

                        userCacheObj.liftsLeft = liftsLeft;
                        userCacheObj.goalsLeft = goalsLeft;

                        if (hasAccessToApi.rows[0] !== undefined) {
                            userCacheObj.apikey = hasAccessToApi.rows[0].apikey;
                        }

                        userCacheObj.badgeColors = badgeColors;

                    } else {
                        results = await client.query(`
                        SELECT users.username, users.displayname, users.member_since
                        FROM users
                        WHERE users.id=$1`,
                            [viewingUser]);

                        userCacheObj = results.rows[0];

                        results = await client.query(`
                        SELECT user_details.*
                        FROM users, user_details
                        WHERE users.id = $1
                        AND users.id = user_details.user_id`,
                            [viewingUser]);

                        delete results.rows[0].user_id;
                        userCacheObj.info = results.rows[0];

                        results = await client.query(`
                        SELECT user_lifts.*
                        FROM users, user_lifts
                        WHERE users.id = $1
                        AND users.id = user_lifts.user_id`,
                            [viewingUser]);

                        delete results.rows[0].user_id;
                        userCacheObj.lifts = results.rows[0];

                        results = await client.query(`
                        SELECT user_goals.*
                        FROM users, user_goals
                        WHERE users.id = $1
                        AND users.id = user_goals.user_id`,
                            [viewingUser]);

                        delete results.rows[0].user_id;
                        userCacheObj.goals = results.rows[0];
                    }
                    //userDetails = results;
                    userDetails = userCacheObj;
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

            results = await client.query(`
            SELECT users.id, users.username, users.displayname, user_settings.*
            FROM users, user_settings
            WHERE users.username = $1
            AND users.id = user_settings.user_id`,
                [username]);

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

            /*results = await client.query(`
            SELECT user_settings.*
            FROM users, user_settings
            WHERE users.username = $1
            AND users.id = user_settings.user_id`,
                [username]);

            const newSettings = results.rows[0].settings;

            newSettings[setting] = value;

            await client.query(`
            UPDATE user_settings
            SET settings=$1
            WHERE username=$2`,
                [newSettings, username]);*/

            const user_id = await client.query(`
            SELECT id
            FROM users
            WHERE username = $1`,
                [username]);

            await client.query(`
            UPDATE user_settings
            SET ${setting} = ${value}
            WHERE user_id = $1`,
                [user_id.rows[0].id]);

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

            const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
            const dayNum = new Date().getDay();

            const day = days[dayNum];

            const workoutUsers = await client.query(`
                        SELECT users.id, users.displayname, ${day}
                        FROM users, user_settings, user_trainingsplit
                        WHERE users.id = user_settings.user_id
                        AND users.id = user_trainingsplit.user_id
                        AND user_settings.displayworkoutlist = true
                        AND user_settings.activetrainingsplit = user_trainingsplit.trainingsplit_id`);

            for (let i = 0; i < workoutUsers.rows.length; i++) {
                const todaysWorkout = workoutUsers.rows[i][day].short;
                if (todaysWorkout) {
                    if (todaysWorkout.length > 0 && todaysWorkout !== "Fri") {
                        infoList.push({ "id": workoutUsers.rows[i].id, "userFullName": workoutUsers.rows[i].displayname, "todaysWorkout": todaysWorkout });
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

                results = await client.query(`
                SELECT user_lifts
                FROM users, user_lifts
                WHERE users.username = $1
                AND users.id = user_lifts.user_id`,
                    [username]);

                const updatedLifts = results.rows[0].lifts;
                updatedLifts[exercise] = { "ORM": kg, "PRdate": date, "color": color };

                console.log("fix update lifts")

                client.end();

                await client.query(`
                UPDATE user_lifts
                SET lifts=$1
                WHERE username=$2`,
                    [updatedLifts, username]);

                results = true;

            } else if (type === "goal") {

                results = await client.query(`
                SELECT user_goals
                FROM users, user_goals
                WHERE users.username = $1
                AND users.id = user_goals.user_id`,
                    [username]);

                const updatedGoals = results.rows[0].goals;

                updatedGoals[exercise] = { "goal": kg, "Goaldate": date, "color": color };

                console.log("fix update goals")

                client.end();

                await client.query(`
                UPDATE user_goals
                SET goals=$1
                WHERE username=$2`,
                    [updatedGoals, username]);

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

                results = await client.query(`
                SELECT user_lifts
                FROM users, user_lifts
                WHERE users.username=$1
                AND users.id = user_lifts.user_id`,
                    [username]);

                const updatedLifts = results.rows[0].lifts;
                delete updatedLifts[exercise];

                console.log("fix delete lifts")

                client.end();

                await client.query(`
                UPDATE user_lifts
                SET lifts=$1
                WHERE username=$2`,
                    [updatedLifts, username]);

                results = true;

            } else if (type === "goal") {

                results = await client.query(`
                SELECT user_goals
                FROM users, user_goals
                WHERE users.username=$1
                AND users.id = user_goals.user_id`,
                    [username]);

                const updatedGoals = results.rows[0].goals;
                delete updatedGoals[exercise];

                console.log("fix delete goals")

                client.end();

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


    //  -------------------------------  update Displayname (user)  ------------------------------- //

    async updateDisplayname(username, newDisplayname) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            await client.query(`
            UPDATE users
            SET displayname = $1
            WHERE username = $2`,
                [newDisplayname, username]);

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }

    //

    //  -------------------------------  update Username (user)  ------------------------------- //

    async updateUsername(username, newUsername) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            //await client.query('UPDATE "users" SET username=$1 WHERE username=$2', [newUsername, username]);

            // checks if username is already taken in pending_users table
            results = await client.query(`
            SELECT username
            FROM pending_users
            WHERE username = $1`,
                [newUsername]);

            if (results.rows.length === 0) {

                // checks if username is already taken in users table
                results = await client.query(`
                SELECT username
                FROM users
                WHERE username = $1`,
                    [newUsername]);

                if (results.rows.length === 0) {

                    await client.query(`
                    UPDATE users
                    SET username = $1
                    WHERE username = $2`,
                        [newUsername, username]);
                    results = true;
                    client.end();

                } else {
                    results = false;
                    client.end();
                }

            } else {
                results = false;
                client.end();
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }

    //


    //  -------------------------------  update Password (user)  ------------------------------- //

    async updatePassword(user, exsistingPsw, newPsw) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let message = "";

        try {
            await client.connect();

            results = await client.query(`
            SELECT password
            FROM users
            WHERE id = $1
            AND password = $2`,
                [user, exsistingPsw]);

            if (results.rows.length !== 0) {

                if (results.rows[0].password !== newPsw) {
                    await client.query(`
                    UPDATE users
                    SET password = $1
                    WHERE id = $2`,
                        [newPsw, user]);
                    results = true;
                } else {
                    message = "Passordet ble ikke endret. Eksisterende passord og nytt passord er like";
                    results = false;
                }

            } else {
                message = "Passordet ble ikke endret. Eksisterende passord er feil";
                results = false;
            }


        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "message": message };
    }

    //

    //  -------------------------------  update about me (user)  ------------------------------- //

    async updateAboutMe(username, aboutme) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            //await client.query('UPDATE "users" SET info=$1 WHERE username=$2', [settings, username]);

            const user_id = await client.query(`
            SELECT id
            FROM users
            WHERE username = $1`,
                [username]);

            if (user_id.rows[0].id) {

                const aboutMeKeys = Object.keys(aboutme);

                const allowedAboutMe = ["gym", "age", "height", "weight"];

                if (aboutMeKeys.length === 4) {

                    let valid = false;

                    for (let i = 0; i < allowedAboutMe.length; i++) {
                        if (allowedAboutMe.includes(aboutMeKeys[i])) {
                            valid = true;
                        } else {
                            valid = false;
                        }
                    }

                    if (valid === true) {

                        const gymValue = aboutme.gym;
                        const ageValue = aboutme.age;
                        const heightValue = aboutme.height;
                        const weightValue = aboutme.weight;

                        await client.query(`
                            UPDATE user_details
                            SET gym = $2, age = $3, height = $4, weight = $5
                            WHERE user_id = $1`,
                            [user_id.rows[0].id, gymValue, ageValue, heightValue, weightValue]);

                    }
                }

                results = true;
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }

    //



    //  -------------------------------  get all user information (user)  ------------------------------- //

    async getAllUserInformation(user) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let userInformation = {};

        try {
            await client.connect();

            //lage noe lignende som når man spør om bruker info? Per kolonne liksom
            /*let userInfo = await client.query(`
            SELECT *
            FROM users, user_details, user_settings, user_lifts, user_goals
            WHERE users.id = $1
            AND users.id = user_details.user_id
            AND users.id = user_settings.user_id
            AND users.id = user_lifts.user_id
            AND users.id = user_goals.user_id`,
                [user]);

            if (userInfo.rows.length !== 0) {
                userInfo = userInfo.rows[0];
                userInformation = userInfo;
                userInfo.password = "Pga sikkerhet, blir ikke passord hentet";
            }

            let trainingsplitInfo = await client.query(`
                SELECT user_trainingsplit.*
                FROM users, user_trainingsplit
                WHERE users.id = $1
                AND users.id = user_trainingsplit.user_id`,
                [user]);

            if (trainingsplitInfo.rows.length !== 0) {
                trainingsplitInfo = trainingsplitInfo.rows[0];
                console.log(trainingsplitInfo);
                userInformation.trainingsplit = trainingsplitInfo
            }

            let apiInfo = await client.query(`
                SELECT user_api.*
                FROM users, user_api
                WHERE users.id = $1
                AND users.id = user_api.user_id`,
                [user]);

            if (apiInfo.rows.length !== 0) {
                apiInfo = apiInfo.rows[0];
                console.log(apiInfo)
            }*/

            //console.log(userInformation)

            client.end();

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "information": userInformation };
    }

    //

    //  -------------------------------  delete account (user)  ------------------------------- //

    async deleteAccount(username, password) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            let userInfo = await client.query(`
            SELECT id
            FROM users
            WHERE username = $1
            AND password = $2`,
                [username, password]);

            if (userInfo.rows.length !== 0) {

                const deleteID = userInfo.rows[0].id;

                //await client.query('DELETE FROM "public"."users" WHERE id=$1', [deleteID]);
                //await client.query('DELETE FROM "public"."api_keys" WHERE user_id=$1', [deleteID]);

                await client.query(`
                DELETE FROM user_trainingsplit
                WHERE user_id=$1`,
                    [deleteID]);

                await client.query(`
                DELETE FROM user_settings
                WHERE user_id=$1`,
                    [deleteID]);

                await client.query(`
                DELETE FROM user_lifts
                WHERE user_id=$1`,
                    [deleteID]);

                await client.query(`
                DELETE FROM user_goals
                WHERE user_id=$1`,
                    [deleteID]);

                await client.query(`
                DELETE FROM user_details
                WHERE user_id=$1`,
                    [deleteID]);

                await client.query(`
                DELETE FROM user_api
                WHERE user_id=$1`,
                    [deleteID]);

                await client.query(`
                DELETE FROM users
                WHERE id=$1`,
                    [deleteID]);

                results = true;
            }



        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }

    //


    //  -------------------------------  give user API Access  ------------------------------- //

    async giveUserAPIAccess(username, giveAPIUserAccess) {
        const client = new pg.Client(this.credentials);
        let results = false;
        try {
            await client.connect();

            const checkIfAdmin = await client.query(`
            SELECT username
            FROM users
            WHERE username = $1
            AND isadmin=true`,
                [username]);

            if (checkIfAdmin.rows.length !== 0) {

                results = await client.query(`
                SELECT user_api.apikey
                FROM users, user_api
                WHERE users.id=$1
                AND users.id = user_api.user_id
                AND user_api.apikey IS NOT null`,
                    [giveAPIUserAccess]);

                if (results.rows.length === 0) {
                    const randomNum = Math.floor(Math.random() * 99999) + giveAPIUserAccess;
                    let generatedAPIKey = giveAPIUserAccess.toString() + randomNum.toString();
                    generatedAPIKey = parseInt(generatedAPIKey);
                    //await client.query('INSERT INTO "api_keys" VALUES($1, $2)', [giveAPIUserAccess, generatedAPIKey]);
                    await client.query(`
                    UPDATE user_api
                    SET apikey = $2
                    WHERE user_api.user_id = $1`,
                        [giveAPIUserAccess, generatedAPIKey]);

                    results = true;
                } else {
                    results = false;
                }

            } else {
                results = false;
            }

            client.end();
        } catch (err) {
            console.log(err);
        }

        return results;
    }

    //


    //  -------------------------------  remove user API Access  ------------------------------- //

    async removeUserAPIAccess(username, removeAPIUserAccess) {
        const client = new pg.Client(this.credentials);
        let results = false;
        try {
            await client.connect();

            const checkIfAdmin = await client.query(`
            SELECT username
            FROM users
            WHERE username = $1
            AND isadmin=true`,
                [username]);

            if (checkIfAdmin.rows.length !== 0) {

                results = await client.query(`
                SELECT user_api.apikey
                FROM users, user_api
                WHERE users.id=$1
                AND users.id = user_api.user_id
                AND user_api.apikey IS NOT null`,
                    [removeAPIUserAccess]);

                if (results.rows.length !== 0) {

                    //await client.query('DELETE FROM "api_keys" WHERE user_id=$1', [removeAPIUserAccess]);
                    await client.query(`
                    UPDATE user_api
                    SET apikey = default
                    WHERE user_api.user_id = $1`,
                        [removeAPIUserAccess]);

                    results = true;
                } else {
                    results = false;
                }

            } else {
                results = false;
            }

            client.end();
        } catch (err) {
            console.log(err);
        }

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

            results = await client.query(`
            SELECT user_id
            FROM user_api
            WHERE apikey = $1
            AND apikey IS NOT null`,
                [key]);

            if (results.rows.length === 0) {

                results = false;

            } else {

                if ((results.rows[0].user_id).toString() === user) {
                    isOwner = true;
                }

                results = await client.query(`
                SELECT publicprofile
                FROM user_settings
                WHERE user_id = $1`,
                    [user]);

                if (results.rows.length === 0) {
                    results = false;
                } else {
                    const userHasPublicProfile = results.rows[0].publicprofile;

                    if (userHasPublicProfile === true || isOwner === true) {
                        //results = await client.query(`SELECT "trainingsplit","displayname" FROM "users" WHERE id=$1`, [user]);

                        results = await client.query(`
                        SELECT activetrainingsplit
                        FROM user_settings
                        WHERE user_id = $1`,
                            [user]);

                        if (results.rows.length !== 0) {

                            if (results.rows[0].hasOwnProperty("activetrainingsplit")) {

                                const activetrainingsplit = results.rows[0].activetrainingsplit;
                                const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                                const dayNum = new Date().getDay();

                                const day = days[dayNum];

                                results = await client.query(`
                                SELECT ${day}
                                FROM user_trainingsplit
                                WHERE user_id = $1
                                AND trainingsplit_id = $2`,
                                    [user, activetrainingsplit]);

                                if (results.rows.length !== 0) {

                                    info.workout = results.rows[0][day].short;

                                    results = await client.query(`
                                    SELECT displayname
                                    FROM users
                                    WHERE id = $1`,
                                        [user]);

                                    if (results.rows.length !== 0) {

                                        info.displayname = results.rows[0].displayname;
                                        results = true;

                                    } else {
                                        results = false;
                                    }

                                } else {
                                    results = false;
                                }

                            } else {
                                results = false;
                            }

                        } else {
                            results = false;
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

            results = await client.query(`
            SELECT user_id
            FROM user_api
            WHERE apikey = $1
            AND apikey IS NOT null`,
                [key]);

            if (results.rows.length === 0) {

                results = false;

            } else {

                if ((results.rows[0].user_id).toString() === user) {
                    isOwner = true;
                }

                results = await client.query(`
                SELECT publicprofile
                FROM user_settings
                WHERE user_id = $1`,
                    [user]);

                if (results.rows.length === 0) {
                    results = false;
                } else {
                    const userHasPublicProfile = results.rows[0].publicprofile;

                    if (userHasPublicProfile === true || isOwner === true) {

                        results = await client.query(`
                        SELECT users.id, users.username, user_lifts.benkpress, user_lifts.knebøy, user_lifts.markløft
                        FROM users, user_lifts
                        WHERE users.id = $1
                        AND users.id = user_lifts.user_id`, [user]);

                        if (results.rows.length !== 0) {

                            const currentUser = results.rows[0];

                            let benkpressKG = 0;
                            let knebøyKG = 0;
                            let markløftKG = 0;
                            const reps = "1";

                            const benkpressLifts = currentUser.benkpress;
                            const benkpressLiftsKeys = Object.keys(benkpressLifts);
                            for (let i = 0; i < benkpressLiftsKeys.length; i++) {

                                const liftIndex = benkpressLifts[benkpressLiftsKeys[i]];

                                if (liftIndex.reps === reps) {
                                    if (liftIndex.kg && liftIndex.kg !== 0 && liftIndex.kg !== "0") {
                                        const currentKG = parseFloat(liftIndex.kg);
                                        if (currentKG > benkpressKG) {
                                            benkpressKG = currentKG;
                                        }
                                    }
                                }
                            }

                            if (benkpressKG > 0) {

                                const knebøyLifts = currentUser.knebøy;
                                const knebøyLiftsKeys = Object.keys(knebøyLifts);
                                for (let i = 0; i < knebøyLiftsKeys.length; i++) {

                                    const liftIndex = knebøyLifts[knebøyLiftsKeys[i]];

                                    if (liftIndex.reps === reps) {
                                        if (liftIndex.kg && liftIndex.kg !== 0 && liftIndex.kg !== "0") {
                                            const currentKG = parseFloat(liftIndex.kg);
                                            if (currentKG > knebøyKG) {
                                                knebøyKG = currentKG;
                                            }
                                        }
                                    }
                                }

                                if (knebøyKG > 0) {

                                    const markløftLifts = currentUser.markløft;
                                    const markløftLiftsKeys = Object.keys(markløftLifts);
                                    for (let i = 0; i < markløftLiftsKeys.length; i++) {

                                        const liftIndex = markløftLifts[markløftLiftsKeys[i]];

                                        if (liftIndex.reps === reps) {
                                            if (liftIndex.kg && liftIndex.kg !== 0 && liftIndex.kg !== "0") {
                                                const currentKG = parseFloat(liftIndex.kg);
                                                if (currentKG > markløftKG) {
                                                    markløftKG = currentKG;
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if (benkpressKG > 0 && knebøyKG > 0 && markløftKG > 0) {
                                const totalORMKG = benkpressKG + knebøyKG + markløftKG;
                                const totalORMLBS = totalORMKG * 2.20462262;
                                info.kg = totalORMKG.toFixed(2);
                                info.lbs = totalORMLBS.toFixed(2);
                                results = true;
                            }
                        }
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