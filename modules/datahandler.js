const pg = require("pg");
const dbCredentials = process.env.DATABASE_URL || require("../localenv").credentials;
const ECustomList = require("./customList").ECustomList;
/*const fs = require("fs");
const test21 = fs.readFileSync("./queries/test.sql").toString();*/
class StorageHandler {

    constructor(credentials) {
        this.credentials = {
            connectionString: credentials,
            ssl: {
                rejectUnauthorized: false
            }
        };
    }

    /// -------------------- Login & Ask for access -------------------- ///

    // login / validate userinfo
    async validateUser(username, password) {
        const client = new pg.Client(this.credentials);
        let results = false;
        let userInfo = {};
        try {
            await client.connect();

            results = await client.query(`
            SELECT id, username, password, displayname
            FROM users
            WHERE username = $1
            AND password = $2`,
                [username, password]);

            if (results.rows.length > 0) {
                userInfo = results.rows[0];

                results = await client.query(`
                SELECT *
                FROM user_settings
                WHERE user_id = $1`,
                    [userInfo.id]);

                if (results.rows.length > 0) {
                    delete results.rows[0].user_id;
                    userInfo.settings = results.rows[0];

                    results = await client.query(`
                SELECT *
                FROM user_details
                WHERE user_id = $1`,
                        [userInfo.id]);

                    if (results.rows.length > 0) {
                        delete results.rows[0].user_id;
                        userInfo.details = results.rows[0];
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


            client.end();
        } catch (err) {
            console.log(err);
        }

        return { "status": results, "userInfo": userInfo };
    }
    // End of validateUser function

    // ask for access / create new user
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

                const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                const requestDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).substr(0, 10);

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
    // End of addUserToPendingList function

    /// -------------------- End of Login & Ask for access -------------------- ///

    /// -------------------- User -------------------- ///

    // get userdetails (view userPage)
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

                        const subscribedtsplits = userCacheObj.settings.subscribedtrainingsplits;
                        const subscribedtsplitswname = {};
                        const updatedSubscriptionList = [];

                        if (subscribedtsplits.length > 0) {
                            for (let i = 0; i < subscribedtsplits.length; i++) {
                                const name = await client.query(`
                            SELECT trainingsplit_name
                            FROM user_trainingsplit
                            WHERE trainingsplit_id = $1`,
                                    [subscribedtsplits[i]]);

                                if (name.rows.length > 0) {

                                    if (!updatedSubscriptionList.includes(subscribedtsplits[i])) {
                                        updatedSubscriptionList.push(subscribedtsplits[i]);
                                        subscribedtsplitswname[subscribedtsplits[i]] = name.rows[0].trainingsplit_name;
                                    }
                                }
                            }
                        }

                        if (updatedSubscriptionList.length !== subscribedtsplits.length) {
                            await client.query(`
                        UPDATE user_settings
                        SET subscribedtrainingsplits = $2
                        WHERE user_id = $1`,
                                [userID, JSON.stringify(updatedSubscriptionList)]);
                        }

                        userCacheObj.settings.subscribedtrainingsplits = subscribedtsplitswname;

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

                        const liftKeys = Object.keys(userCacheObj.lifts);

                        let liftsUsed = 0;

                        for (let i = 0; i < liftKeys.length; i++) {

                            const lifts = userCacheObj.lifts;
                            const liftPerExerciseKeys = Object.keys(lifts[liftKeys[i]]);

                            for (let j = 0; j < liftPerExerciseKeys.length; j++) {
                                liftsUsed++;
                            }
                        }

                        const liftsLeft = ECustomList.max.lifts - liftsUsed;

                        const goalKeys = Object.keys(userCacheObj.goals);

                        let goalsUsed = 0;

                        for (let i = 0; i < goalKeys.length; i++) {

                            const goals = userCacheObj.goals;
                            const goalsPerExerciseKeys = Object.keys(goals[goalKeys[i]]);

                            for (let j = 0; j < goalsPerExerciseKeys.length; j++) {
                                goalsUsed++;
                            }
                        }

                        const goalsLeft = ECustomList.max.goals - goalsUsed;

                        userCacheObj.liftsLeft = liftsLeft;
                        userCacheObj.goalsLeft = goalsLeft;

                        if (hasAccessToApi.rows[0] !== undefined) {
                            userCacheObj.apikey = hasAccessToApi.rows[0].apikey;
                        }

                        const t_id = await client.query(`
                            SELECT activetrainingsplit
                            FROM user_settings
                            WHERE user_id = $1`,
                            [userIDReq]);

                        if (t_id.rows.length !== 0) {

                            if (t_id.rows[0].hasOwnProperty("activetrainingsplit")) {

                                const activetrainingsplit = await client.query(`
                            SELECT *
                                FROM user_trainingsplit
                            WHERE trainingsplit_id = $1`,
                                    [t_id.rows[0].activetrainingsplit]);

                                if (activetrainingsplit.rows.length !== 0) {

                                    if (activetrainingsplit.rows[0].user_id === userIDReq) {
                                        activetrainingsplit.rows[0].canEdit = true;
                                    }

                                    userCacheObj.activetrainingsplit = activetrainingsplit.rows[0];

                                    let username = await client.query(`
                            SELECT username
                            FROM users
                            WHERE id = $1`,
                                        [activetrainingsplit.rows[0].user_id]);

                                    if (username.rows.length > 0) {
                                        userCacheObj.activetrainingsplit.owner = username.rows[0].username;
                                    }

                                } else {
                                    await client.query(`
                                UPDATE user_settings
                                SET activetrainingsplit = null
                                WHERE user_id = $1`,
                                        [userIDReq]);
                                }
                            }
                        }

                        const allTrainingsplits = await client.query(`
                            SELECT trainingsplit_id, trainingsplit_name
                            FROM user_trainingsplit
                            WHERE user_id = $1`,
                            [userIDReq]);

                        if (allTrainingsplits.rows.length > 0) {
                            allTrainingsplits.rows.sort(function (a, b) {
                                if (a.trainingsplit_name < b.trainingsplit_name) { return -1; }
                                if (a.trainingsplit_name > b.trainingsplit_name) { return 1; }
                                return 0;
                            });
                            userCacheObj.alltrainingsplits = allTrainingsplits.rows;
                        }

                        const trainingsplitsLeft = ECustomList.max.trainingsplits - allTrainingsplits.rows.length;
                        userCacheObj.trainingsplitsLeft = trainingsplitsLeft;

                    } else {
                        results = await client.query(`
                            SELECT users.username, users.displayname, users.member_since
                            FROM users
                            WHERE users.id = $1`,
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

                        const t_id = await client.query(`
                            SELECT activetrainingsplit
                            FROM user_settings
                            WHERE user_id = $1`,
                            [viewingUser]);

                        if (t_id.rows.length !== 0) {

                            if (t_id.rows[0].hasOwnProperty("activetrainingsplit")) {

                                const activetrainingsplit = await client.query(`
                            SELECT *
                                FROM user_trainingsplit
                            WHERE trainingsplit_id = $1`,
                                    [t_id.rows[0].activetrainingsplit]);

                                if (activetrainingsplit.rows.length !== 0) {
                                    userCacheObj.activetrainingsplit = activetrainingsplit.rows[0];

                                    let username = await client.query(`
                            SELECT username
                            FROM users
                            WHERE id = $1`,
                                        [activetrainingsplit.rows[0].user_id]);

                                    if (username.rows.length > 0) {
                                        userCacheObj.activetrainingsplit.owner = username.rows[0].username;
                                    }
                                }
                            }
                        }
                    }
                    userCacheObj.badgeColors = ECustomList.other.badgeColors;
                    userCacheObj.allowedLifts = ECustomList.allowed.lifts;
                    userCacheObj.allowedGoals = ECustomList.allowed.goals;
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
    // End of getUserDetails function

    // update Displayname (user)
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
    // End of updateDisplayname function

    // update Username (user)
    async updateUsername(username, newUsername) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

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
    // End of updateUsername function

    // update Password (user)
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
    // End of updatePassword function

    // update about me (user)
    async updateAboutMe(username, aboutme) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

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
    // End of updateAboutMe function

    // get userdetails (private settings page)
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
    // End of getUserSettingsAndInfo function

    // update usersettings (private settings page)
    async updateUserSetting(username, setting, value) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            if (value !== false) {
                if (!value || value === "null") {
                    value = null;
                }
            }

            const user_id = await client.query(`
                SELECT id
                FROM users
                WHERE username = $1`,
                [username]);

            await client.query(`
                UPDATE user_settings
                SET ${setting} = $1
                WHERE user_id = $2`,
                [value, user_id.rows[0].id]);

            results = true;

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return results;
    }
    // End of updateUserSetting function

    // decrease medalscount
    async decreaseMedalCount(userid, count) {
        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            let medalscount = await client.query(`
                SELECT medalscount
                FROM user_details
                WHERE user_id = $1`,
                [userid]);

            if (medalscount.rows.length > 0) {
                medalscount = medalscount.rows[0].medalscount;

                if (medalscount > 0) {
                    medalscount = medalscount - count;
                    if (medalscount < 0) {
                        medalscount = 0;
                    }

                    await client.query(`
                    UPDATE user_details
                    SET medalscount = $1
                    WHERE user_id = $2`,
                        [medalscount, userid]);

                    results = true;
                }
            }

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return results;
    }
    // End of decreaseMedalCount function

    // get all user information (user)
    async getAllUserInformation(user) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let userInformation = {};

        try {
            await client.connect();

            const userInfo = await client.query(`
                                SELECT *
                                    FROM users
                                WHERE id = $1`,
                [user]);

            if (userInfo.rows.length > 0) {
                if (userInfo.rows[0].isadmin !== true) {
                    delete userInfo.rows[0].isadmin;
                }
                userInfo.rows[0].password = "Passord blir ikke hentet.";
                userInformation.bruker = userInfo.rows[0];
            }

            const userDetails = await client.query(`
                                SELECT *
                                    FROM user_details
                                WHERE user_id = $1`,
                [user]);

            if (userDetails.rows.length > 0) {
                delete userDetails.rows[0].user_id;
                userInformation.detaljer = userDetails.rows[0];
            }

            const userSettings = await client.query(`
                                SELECT *
                                    FROM user_settings
                                WHERE user_id = $1`,
                [user]);

            if (userSettings.rows.length > 0) {
                delete userSettings.rows[0].user_id;
                userInformation.innstillinger = userSettings.rows[0];
            }

            const userLifts = await client.query(`
                                SELECT *
                                    FROM user_lifts
                                WHERE user_id = $1`,
                [user]);

            if (userLifts.rows.length > 0) {
                delete userLifts.rows[0].user_id;
                userInformation.løft = userLifts.rows[0];
            }

            const userGoals = await client.query(`
                                SELECT *
                                    FROM user_goals
                                WHERE user_id = $1`,
                [user]);

            if (userGoals.rows.length > 0) {
                delete userGoals.rows[0].user_id;
                userInformation.mål = userGoals.rows[0];
            }

            const userTrainingsplit = await client.query(`
                                SELECT *
                                    FROM user_trainingsplit
                                WHERE user_id = $1`,
                [user]);

            if (userTrainingsplit.rows.length > 0) {
                for (let i = 0; i < userTrainingsplit.rows.length; i++) {
                    delete userTrainingsplit.rows[i].user_id;
                }
                userInformation.treningsplan = userTrainingsplit.rows;
            }

            client.end();

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "information": userInformation };
    }
    // End of getAllUserInformation function

    // delete account (user)
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

                await client.query(`
                                DELETE FROM user_trainingsplit
                                WHERE user_id = $1`,
                    [deleteID]);

                await client.query(`
                                DELETE FROM user_settings
                                WHERE user_id = $1`,
                    [deleteID]);

                await client.query(`
                                DELETE FROM user_lifts
                                WHERE user_id = $1`,
                    [deleteID]);

                await client.query(`
                                DELETE FROM user_goals
                                WHERE user_id = $1`,
                    [deleteID]);

                await client.query(`
                                DELETE FROM user_details
                                WHERE user_id = $1`,
                    [deleteID]);

                await client.query(`
                                DELETE FROM user_api
                                WHERE user_id = $1`,
                    [deleteID]);

                await client.query(`
                                DELETE FROM users
                                WHERE id = $1`,
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
    // End of deleteAccount function

    /// -------------------- End of User -------------------- ///

    /// -------------------- Lift & Goal -------------------- ///

    // save/update lift or goal
    async saveLiftOrGoal(userid, info) {
        //userid, info, color
        //userid, reps, exercise, kg, date, type, color
        const client = new pg.Client(this.credentials);
        let results = false;

        const exercise = info.exercise;
        const kg = info.kg;
        const reps = info.reps;
        const date = info.date;
        const type = info.type;
        const id = info.id;
        const color = info.color;

        try {
            await client.connect();

            let table = "user_lifts";

            if (type === "goal") {
                table = "user_goals";
            }

            results = await client.query(`
                            SELECT "${exercise}"
                            FROM ${table}
                            WHERE user_id = $1`,
                [userid]);

            if (results.rows.length === 1) {

                const liftsOrGoals = results.rows[0][exercise];

                const liftOrGoal = { "id": id, "reps": reps, "kg": kg, "date": date, "color": color };

                if (exercise.includes("i vekt")) {
                    delete liftOrGoal.reps;
                }

                if (type === "goal") {
                    liftOrGoal.completed = false;
                }

                if (id === null) {
                    generateRandomID();
                }

                function generateRandomID() {

                    let random = Math.floor(Math.random() * ((liftsOrGoals.length + 1) * 99999));
                    random = liftsOrGoals.length + random.toString();

                    for (let i = 0; i < liftsOrGoals.length; i++) {
                        const current = liftsOrGoals[i].id;
                        if (random === current) {
                            generateRandomID();
                        }
                    }

                    liftOrGoal.id = random;

                }

                let modify = false;
                let index = null;

                for (let i = 0; i < liftsOrGoals.length; i++) {
                    const current = liftsOrGoals[i].id;
                    if (id === current) {
                        modify = true;
                        index = i;
                    }
                }

                if (modify === true && index >= 0) {
                    liftsOrGoals[index] = liftOrGoal;
                } else {
                    liftsOrGoals.push(liftOrGoal);
                }

                await client.query(`
                            UPDATE ${table}
                            SET "${exercise}" = $1
                            WHERE user_id = $2`,
                    [JSON.stringify(liftsOrGoals), userid]);

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
    // End of saveLiftOrGoal function

    // delete lift or goal
    async deleteLiftOrGoal(userid, info) {

        const exercise = info.exercise;
        const type = info.type;
        const id = info.id;
        //info.exercise, info.type, info.index

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            let table = "user_lifts";

            if (type === "goal") {
                table = "user_goals";
            }

            results = await client.query(`
                                SELECT "${exercise}"
                                FROM ${table}
                                WHERE user_id = $1`,
                [userid]);

            if (results.rows.length === 1) {

                const liftsOrGoals = results.rows[0][exercise];

                function findWithAttr(value) {
                    for (var i = 0; i < liftsOrGoals.length; i += 1) {
                        if (liftsOrGoals[i].id === value) {
                            return i;
                        }
                    }
                    return -1;
                }

                const index = findWithAttr(id);
                if (index >= 0) {

                    liftsOrGoals.splice(index, 1);

                    await client.query(`
                                UPDATE ${table}
                                SET "${exercise}" = $1
                                WHERE user_id = $2`,
                        [JSON.stringify(liftsOrGoals), userid]);

                    results = true;

                }

            }

            client.end();

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();

        return results;
    }
    // End of deleteLiftOrGoal function

    // set goal as complete
    async setGoalAsComplete(userid, completedGoalsList) {
        const client = new pg.Client(this.credentials);
        let results = false;
        let totalMedals = 0;

        try {
            await client.connect();

            const completedGoalsListKeys = Object.keys(completedGoalsList);

            for (let i = 0; i < completedGoalsListKeys.length; i++) {
                const current = completedGoalsListKeys[i];

                results = await client.query(`
                        SELECT "${current}"
                        FROM user_goals
                        WHERE user_id = $1`,
                    [userid]);

                if (results.rows.length === 1) {

                    const currentList = completedGoalsList[current];
                    const currentListKeys = Object.keys(currentList);

                    const goals = results.rows[0][current];

                    let modify = false;
                    let modifyCount = 0;

                    for (let j = 0; j < currentListKeys.length; j++) {

                        const currentGoal = currentList[currentListKeys[j]];

                        for (let z = 0; z < goals.length; z++) {
                            const goal = goals[z];
                            const completed = goal.completed;
                            if (currentGoal === goal.id) {
                                if (completed !== true) {
                                    modify = true;
                                    modifyCount++;
                                    goals[z].completed = true;
                                } else {
                                    break;
                                }
                            }
                        }
                    }

                    if (modify === true) {

                        if (modifyCount < ECustomList.max.goals) {
                            await client.query(`
                                UPDATE user_goals
                                SET "${current}" = $1
                                WHERE user_id = $2`,
                                [JSON.stringify(goals), userid]);

                            let medalscount = await client.query(`
                                SELECT medalscount
                                FROM user_details
                                WHERE user_id = $1`,
                                [userid]);

                            if (medalscount.rows.length > 0) {

                                medalscount = medalscount.rows[0].medalscount;
                                medalscount = medalscount + modifyCount;
                                totalMedals = medalscount;
                                await client.query(`
                                UPDATE user_details
                                SET medalscount = $1
                                WHERE user_id = $2`,
                                    [medalscount, userid]);
                            }
                        }
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

        return { "status": results, "totalMedals": totalMedals };
    }
    // End of setGoalAsComplete function

    /// -------------------- End of Lift & Goal -------------------- ///

    /// -------------------- Trainingsplit -------------------- ///

    // create Trainingsplit (user)
    async createTrainingsplit(userid) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let newtrainingsplit_id = null;

        try {
            await client.connect();

            const allTrainingsplits = await client.query(`
                            SELECT trainingsplit_id, trainingsplit_name
                            FROM user_trainingsplit
                            WHERE user_id = $1`,
                [userid]);

            if (allTrainingsplits.rows.length < ECustomList.max.trainingsplits) {

                const trainingsplitName = `Treningsplan ${allTrainingsplits.rows.length + 1}`;

                const newTrainingsplit = await client.query(`
                            INSERT INTO user_trainingsplit(user_id, trainingsplit_name)
                            VALUES($1, $2) RETURNING trainingsplit_id`, [userid, trainingsplitName]);

                if (newTrainingsplit.rows.length > 0) {
                    newtrainingsplit_id = newTrainingsplit.rows[0].trainingsplit_id;
                    results = true;
                }

            } else {
                results = false;
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "newtrainingsplit_id": newtrainingsplit_id };
    }
    // End of createTrainingsplit function

    // delete Trainingsplit (user)
    async deleteTrainingsplit(userid, trainingsplit_id) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            await client.query(`
                                DELETE FROM user_trainingsplit
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                [trainingsplit_id, userid]);

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }
    // End of deleteTrainingsplit function

    // save Trainingsplit (user)
    async saveTrainingsplit(userid, trainingsplit_id, day, list, trainingsplit_name, trainingsplit_short) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let trainingsplit = {};

        try {
            await client.connect();

            results = await client.query(`
            SELECT ${day}
            FROM user_trainingsplit
            WHERE trainingsplit_id = $1
            AND user_id = $2`,
                [trainingsplit_id, userid]);

            if (results.rows.length > 0) {

                trainingsplit = results.rows[0][day];

                trainingsplit.list = list;
                if (trainingsplit.list.length > 0) {
                    trainingsplit.short = trainingsplit_short;
                } else {
                    trainingsplit.short = "";
                }

                await client.query(`
                UPDATE user_trainingsplit
                SET trainingsplit_name = $1
                WHERE trainingsplit_id = $2
                AND user_id = $3`,
                    [trainingsplit_name, trainingsplit_id, userid]);

                await client.query(`
                UPDATE user_trainingsplit
                SET ${day} = $1
                WHERE trainingsplit_id = $2
                AND user_id = $3`,
                    [JSON.stringify(trainingsplit), trainingsplit_id, userid]);

                results = true;
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }
    // End of saveTrainingsplit function

    // get Trainingsplit (user)
    async getTrainingsplit(userid, trainingsplit_id) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let trainingsplit = {};
        let isSubscribed = false;
        let msg = "";

        try {
            await client.connect();

            results = await client.query(`
            SELECT *
            FROM user_trainingsplit
            WHERE trainingsplit_id = $1`,
                [trainingsplit_id]);

            let subscribedtrainingsplits = await client.query(`
            SELECT subscribedtrainingsplits
            FROM user_settings
            WHERE user_id = $1`,
                [userid]);

            if (subscribedtrainingsplits.rows.length > 0) {

                subscribedtrainingsplits = subscribedtrainingsplits.rows[0].subscribedtrainingsplits;

                if (subscribedtrainingsplits.includes(trainingsplit_id.toString())) {
                    isSubscribed = true;
                }
            }


            if (results.rows.length > 0) {

                trainingsplit = results.rows[0];

                if (trainingsplit.user_id === userid || trainingsplit.public === true || isSubscribed === true) {
                    let canEdit = false;
                    if (trainingsplit.user_id === userid) {
                        canEdit = true;
                        trainingsplit.maxTrainingsplitsExerciseRows = ECustomList.max.trainingsplitsExerciseRows;
                        trainingsplit.maxTrainingsplitsExercisesPerDay = ECustomList.max.trainingsplitsExercisesPerDay;
                    } else {
                        let username = await client.query(`
                        SELECT username
                        FROM users
                        WHERE id = $1`,
                            [trainingsplit.user_id]);

                        if (username.rows.length > 0) {
                            trainingsplit.owner = username.rows[0].username;
                        }
                    }

                    trainingsplit.canEdit = canEdit;
                    results = true;
                } else {
                    msg = "Treningsplanen er privat!";
                    results = false;
                }
            } else {
                msg = "Treningsplanen finnes ikke!";
                results = false;
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "trainingsplit": trainingsplit, "msg": msg };
    }
    // End of getTrainingsplit function

    // copy Trainingsplit (user)
    async copyTrainingsplit(userid, trainingsplit_id, owner_id) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let newtrainingsplit_id = null;
        let msg = "";

        try {
            await client.connect();

            const allTrainingsplits = await client.query(`
                                SELECT trainingsplit_id, trainingsplit_name
                                FROM user_trainingsplit
                                WHERE user_id = $1`,
                [userid]);

            if (allTrainingsplits.rows.length < ECustomList.max.trainingsplits) {

                let copyTrainingsplit = await client.query(`
                                SELECT *
                                    FROM user_trainingsplit
                                WHERE user_id = $1
                                AND trainingsplit_id = $2`,
                    [owner_id, trainingsplit_id]);

                if (copyTrainingsplit.rows.length > 0) {

                    let isOwner = false;

                    copyTrainingsplit = copyTrainingsplit.rows[0];

                    if (parseInt(copyTrainingsplit.user_id) === userid) {
                        isOwner = true;
                    }

                    if (copyTrainingsplit.public === true || isOwner === true) {

                        delete copyTrainingsplit.user_id;
                        delete copyTrainingsplit.trainingsplit_id;

                        const name = copyTrainingsplit.trainingsplit_name;
                        const monday = copyTrainingsplit.monday;
                        const tuesday = copyTrainingsplit.tuesday;
                        const wednesday = copyTrainingsplit.wednesday;
                        const thursday = copyTrainingsplit.thursday;
                        const friday = copyTrainingsplit.friday;
                        const saturday = copyTrainingsplit.saturday;
                        const sunday = copyTrainingsplit.sunday;

                        const newTrainingsplit = await client.query(`
                                INSERT INTO user_trainingsplit(user_id, trainingsplit_name, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
                                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING trainingsplit_id`, [userid, name, monday, tuesday, wednesday, thursday, friday, saturday, sunday]);

                        if (newTrainingsplit.rows.length > 0) {
                            newtrainingsplit_id = newTrainingsplit.rows[0].trainingsplit_id;
                            results = true;
                        }

                    } else {
                        msg = `Du kan ikke kopiere en privat treningsplan!`;
                        results = false;
                    }

                } else {
                    msg = `Treningsplanen finnes ikke!`;
                    results = false;
                }

            } else {
                msg = `Du kan ikke ha flere enn ${ECustomList.max.trainingsplits} treningsplaner!`;
                results = false;
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "newtrainingsplit_id": newtrainingsplit_id, "msg": msg };
    }
    // End of copyTrainingsplit function

    // sub or unsub to Trainingsplit (user)
    async subUnsubTrainingsplit(userid, trainingsplit_id, owner_id) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let update = false;
        let msg = "";

        try {
            await client.connect();


            const trainingsplit = await client.query(`
                                SELECT *
                                    FROM user_trainingsplit
                                WHERE user_id = $1
                                AND trainingsplit_id = $2`,
                [owner_id, trainingsplit_id]);

            if (trainingsplit.rows.length > 0) {

                let subscribedTrainingsplits = await client.query(`
                                SELECT subscribedtrainingsplits
                                FROM user_settings
                                WHERE user_id = $1`,
                    [userid]);

                const tIDString = trainingsplit_id.toString();

                subscribedTrainingsplits = subscribedTrainingsplits.rows[0].subscribedtrainingsplits;

                if (subscribedTrainingsplits.includes(tIDString)) {
                    //unsubscribe

                    for (let i = 0; i < subscribedTrainingsplits.length; i++) {
                        if (subscribedTrainingsplits[i] === tIDString) {
                            subscribedTrainingsplits.splice(i, 1);
                            msg = `Du abonnerer ikke lenger på denne planen`;
                            update = true;
                        }
                    }

                } else {

                    if (trainingsplit.rows[0].public === true) {

                        if (subscribedTrainingsplits.length < ECustomList.max.subscribedTrainingsplits) {
                            //subscribe
                            subscribedTrainingsplits.push(tIDString);
                            msg = `Du abonnerer nå på denne planen`;
                            update = true;
                        } else {
                            msg = `Du kan ikke abonnere på flere enn ${ECustomList.max.subscribedTrainingsplits} treningsplaner!`;
                            update = false;
                        }
                    } else {
                        msg = `Treningsplanen er privat!`;
                        results = false;
                    }
                }

                if (update === true) {

                    await client.query(`
                                UPDATE user_settings
                                SET subscribedtrainingsplits = $2
                                WHERE user_id = $1`,
                        [userid, JSON.stringify(subscribedTrainingsplits)]);

                    results = true;
                }

            } else {
                msg = `Treningsplanen finnes ikke!`;
                results = false;
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "msg": msg };
    }
    // End of subUnsubTrainingsplit function

    // set active Trainingsplit (user)
    async setActiveTrainingsplit(userid, trainingsplit_id) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            results = await client.query(`
                                UPDATE user_settings
                                SET activetrainingsplit = $2
                                WHERE user_id = $1`,
                [userid, trainingsplit_id]);

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }
    // End of setActiveTrainingsplit function

    // set not active Trainingsplit (user)
    async setNotActiveTrainingsplit(userid) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            results = await client.query(`
             UPDATE user_settings
             SET activetrainingsplit = default
             WHERE user_id = $1`,
                [userid]);

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }
    // End of setNotActiveTrainingsplit function

    // change TrainingsplitVisibility (user)
    async changeTrainingsplitVisibility(userid, trainingsplit_id, value) {

        const client = new pg.Client(this.credentials);
        let results = false;

        try {
            await client.connect();

            await client.query(`
            UPDATE user_trainingsplit
            SET public = $1
            WHERE trainingsplit_id = $2
            AND user_id = $3`,
                [value, trainingsplit_id, userid]);

            results = true;

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return results;
    }
    // End of changeTrainingsplitVisibility function

    // add exercise Trainingsplit (user)
    async addExerciseTrainingsplit(userid, trainingsplit_id, exercise, day) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let msg = "";

        try {
            await client.connect();

            const trainingsplit = await client.query(`
                                SELECT ${day}
                                FROM user_trainingsplit
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                [trainingsplit_id, userid]);

            if (trainingsplit.rows.length > 0) {

                let editedTrainingsplit = trainingsplit.rows[0][day];

                if (editedTrainingsplit) {

                    if (ECustomList.max.trainingsplitsExercisesPerDay > editedTrainingsplit.list.length) {

                        let create = true;
                        for (let i = 0; i < editedTrainingsplit.list.length; i++) {

                            if (Object.keys(editedTrainingsplit.list[i])[0].toLowerCase() !== exercise.toLowerCase()) {
                                if (editedTrainingsplit.list[i][exercise]) {
                                    create = false;
                                    break;
                                }
                            } else {
                                create = false;
                                break;
                            }
                        }

                        if (create === true) {
                            editedTrainingsplit.list.push({ [exercise]: [] });

                            await client.query(`
                                UPDATE user_trainingsplit
                                SET ${day} = $3
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                                [trainingsplit_id, userid, editedTrainingsplit]);

                            results = true;
                        } else {
                            msg = "Øvelsen er allerede lagt til i planen!";
                        }
                    } else {
                        msg = `Du kan ikke ha flere enn ${ECustomList.max.trainingsplitsExercisesPerDay} øvelser på en dag!`;
                    }
                }
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "msg": msg };
    }
    // End of addExerciseTrainingsplit function

    // delete exercise Trainingsplit (user)
    async deleteExerciseTrainingsplit(userid, trainingsplit_id, exercise, day) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let msg = "";

        try {
            await client.connect();

            const trainingsplit = await client.query(`
                                SELECT ${day}
                                FROM user_trainingsplit
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                [trainingsplit_id, userid]);

            if (trainingsplit.rows.length > 0) {

                let editedTrainingsplit = trainingsplit.rows[0][day];

                if (editedTrainingsplit) {

                    for (let i = 0; i < editedTrainingsplit.list.length; i++) {
                        if (editedTrainingsplit.list[i][exercise]) {
                            editedTrainingsplit.list.splice(i, 1);
                            break;
                        }
                    }

                    await client.query(`
                                UPDATE user_trainingsplit
                                SET ${day} = $3
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                        [trainingsplit_id, userid, editedTrainingsplit]);

                    results = true;

                }
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "msg": msg };
    }
    // End of deleteExerciseTrainingsplit function

    // change exercise order Trainingsplit (user)
    async changeExerciseOrderTrainingsplit(userid, trainingsplit_id, day, index, moveUp) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let msg = "";

        try {

            await client.connect();

            const trainingsplit = await client.query(`
                SELECT ${day}
                FROM user_trainingsplit
                WHERE trainingsplit_id = $1
                AND user_id = $2`,
                [trainingsplit_id, userid]);

            if (trainingsplit.rows.length > 0) {

                let editedTrainingsplit = trainingsplit.rows[0][day];

                if (editedTrainingsplit) {

                    if (ECustomList.max.trainingsplitsExercisesPerDay >= editedTrainingsplit.list.length) {

                        let delta = 1;

                        if (moveUp === true) {
                            delta = -1;
                        }

                        const arr = editedTrainingsplit.list;

                        const newIndex = index + delta;
                        if (newIndex < 0 || newIndex == arr.length) { return; } //Already at the top or bottom.
                        const indexes = [index, newIndex].sort((a, b) => a - b); //Sort the indixes (fixed)
                        arr.splice(indexes[0], 2, arr[indexes[1]], arr[indexes[0]]); //Replace from lowest index, two elements, reverting the order

                        await client.query(`
                            UPDATE user_trainingsplit
                            SET ${day} = $3
                            WHERE trainingsplit_id = $1
                            AND user_id = $2`,
                            [trainingsplit_id, userid, editedTrainingsplit]);

                        results = true;

                    } else {
                        msg = `Du kan ikke ha flere enn ${ECustomList.max.trainingsplitsExercisesPerDay} øvelser på en dag!`;
                    }
                }
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "msg": msg };
    }
    // End of changeExerciseOrderTrainingsplit function

    // add exercise row Trainingsplit (user)
    async addExerciseRowTrainingsplit(userid, trainingsplit_id, exercise, day) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let msg = "";

        try {
            await client.connect();

            const trainingsplit = await client.query(`
                                SELECT ${day}
                                FROM user_trainingsplit
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                [trainingsplit_id, userid]);

            if (trainingsplit.rows.length > 0) {

                let editedTrainingsplit = trainingsplit.rows[0][day];

                if (editedTrainingsplit) {

                    let update = false;

                    for (let i = 0; i < editedTrainingsplit.list.length; i++) {
                        if (editedTrainingsplit.list[i][exercise]) {
                            if (ECustomList.max.trainingsplitsExerciseRows > editedTrainingsplit.list[i][exercise].length) {
                                update = true;
                                editedTrainingsplit.list[i][exercise].push({ "sets": 0, "reps": 0, "number": 0, "value": 0 });
                            } else {
                                msg = `Du kan ikke ha flere rader enn ${ECustomList.max.trainingsplitsExerciseRows} på en øvelse!`;
                            }
                            break;
                        }
                    }

                    if (update === true) {

                        await client.query(`
                                UPDATE user_trainingsplit
                                SET ${day} = $3
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                            [trainingsplit_id, userid, editedTrainingsplit]);

                        results = true;

                    }
                }
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "msg": msg };
    }
    // End of addExerciseRowTrainingsplit function



    // delete exercise row Trainingsplit (user)
    async deleteExerciseRowTrainingsplit(userid, trainingsplit_id, exercise, index, day) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let msg = "";

        try {
            await client.connect();

            const trainingsplit = await client.query(`
                                SELECT ${day}
                                FROM user_trainingsplit
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                [trainingsplit_id, userid]);

            if (trainingsplit.rows.length > 0) {

                let editedTrainingsplit = trainingsplit.rows[0][day];

                if (editedTrainingsplit) {

                    for (let i = 0; i < editedTrainingsplit.list.length; i++) {
                        if (editedTrainingsplit.list[i][exercise]) {
                            if (editedTrainingsplit.list[i][exercise][index]) {
                                editedTrainingsplit.list[i][exercise].splice(index, 1);
                            }
                            break;
                        }
                    }

                    await client.query(`
                                UPDATE user_trainingsplit
                                SET ${day} = $3
                                WHERE trainingsplit_id = $1
                                AND user_id = $2`,
                        [trainingsplit_id, userid, editedTrainingsplit]);

                    results = true;

                }
            }

        } catch (err) {
            client.end();
            console.log(err);
        }

        client.end();
        return { "status": results, "msg": msg };
    }
    // End of deleteExerciseRowTrainingsplit function

    /// -------------------- End of Trainingsplit -------------------- ///

    /// -------------------- Other -------------------- ///

    // get list of all public users that are working out today
    async getListOfAllUsersWorkoutToday() {

        const client = new pg.Client(this.credentials);
        let results = false;
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
                            AND user_settings.displayworkoutlist = true
                            AND user_settings.activetrainingsplit = user_trainingsplit.trainingsplit_id`);

            for (let i = 0; i < workoutUsers.rows.length; i++) {
                const todaysWorkout = workoutUsers.rows[i][day].short;
                if (todaysWorkout) {
                    if (todaysWorkout.length > 0) {
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
    // End of getListOfAllUsersWorkoutToday function

    // get a list of all users in application
    async getListOfAllUsers(username) {
        const client = new pg.Client(this.credentials);
        let results = false;
        let allUsers = null;
        let allAPIUsers = null;
        try {
            await client.connect();

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
                allUsers = await client.query(`
                SELECT users.id, users.username, users.displayname
                FROM users, user_settings
                WHERE users.id = user_settings.user_id
                AND user_settings.publicprofile = true`);

                allUsers = allUsers.rows;
                results = true;
            }

            client.end();
        } catch (err) {
            console.log(err);
        }

        return { "status": results, "allUsers": allUsers, "allAPIUsers": allAPIUsers };
    }
    // End of getListOfAllUsers function

    // get a list of all leaderboards in application
    async getListOfLeaderboards(reps) {
        const client = new pg.Client(this.credentials);
        let results = false;

        let leaderboards = {};
        const repsList = [];

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

                if (reps === "1") {
                    if (liftKeys.includes("benkpress") && liftKeys.includes("knebøy") && liftKeys.includes("markløft")) {
                        if (Object.entries(lifts.benkpress).length > 0 && Object.entries(lifts.knebøy).length > 0 && Object.entries(lifts.markløft).length > 0) {
                            const benkpress = lifts.benkpress;
                            const knebøy = lifts.knebøy;
                            const markløft = lifts.markløft;
                            let benchpressOk = false;
                            let squatOk = false;

                            for (let k = 0; k < benkpress.length; k++) {
                                if (benkpress[k].reps === reps) {
                                    benchpressOk = true;
                                    break;
                                }
                            }

                            if (benchpressOk === true) {
                                for (let k = 0; k < knebøy.length; k++) {
                                    if (knebøy[k].reps === reps) {
                                        squatOk = true;
                                        break;
                                    }
                                }

                                if (squatOk === true) {
                                    for (let k = 0; k < markløft.length; k++) {
                                        if (markløft[k].reps === reps) {
                                            const updateNumber = parseInt(leaderboards["totalt"]) || 0;
                                            leaderboards["totalt"] = updateNumber + 1;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (let j = 0; j < liftKeys.length; j++) {
                    let isValid = false;
                    for (let z = 0; z < ECustomList.allowed.lifts.length; z++) {
                        if (liftKeys[j] === ECustomList.allowed.lifts[z]) {
                            isValid = true;
                            break;
                        }
                    }
                    if (isValid === true) {
                        const extra = lifts[liftKeys[j]];
                        let done = false;
                        for (let k = 0; k < extra.length; k++) {
                            if (extra[k].reps === reps && done === false) {
                                const updateNumber = parseInt(leaderboards[liftKeys[j]]) || 0;
                                leaderboards[liftKeys[j]] = updateNumber + 1;
                                done = true;
                            }

                            if (!repsList.includes(extra[k].reps)) {
                                repsList.push(extra[k].reps);
                            }
                        }
                    }
                }
            }

            repsList.sort(function (a, b) {
                return a - b;
            });

            results = true;

            client.end();
        } catch (err) {
            console.log(err);
        }

        return { "leaderboards": leaderboards, "repsList": repsList, "status": results };
    }
    // End of getListOfLeaderboards function

    // get a info about a specific leaderboard (users and numbers)
    async getListOfUsersLeaderboard(leaderboard, reps) {
        const client = new pg.Client(this.credentials);
        let results = null;
        const infoList = [];

        try {
            await client.connect();

            let isValid = false;
            for (let z = 0; z < ECustomList.allowed.lifts.length; z++) {
                if (leaderboard === ECustomList.allowed.lifts[z]) {
                    isValid = true;
                    break;
                }
            }

            if (isValid === true || leaderboard === "totalt") {

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
    // End of getListOfUsersLeaderboard function

    /// -------------------- End of Other -------------------- ///

    /// -------------------- Admin -------------------- ///

    // get a list of all pending users in application
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
    // End of getListOfPendingUsers function

    // accept or deny pending user
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
    // End of acceptOrDenyUser function

    // give user API Access
    async giveUserAPIAccess(username, giveAPIUserAccess) {
        const client = new pg.Client(this.credentials);
        let results = false;
        try {
            await client.connect();

            const checkIfAdmin = await client.query(`
                                SELECT username
                                FROM users
                                WHERE username = $1
                                AND isadmin = true`,
                [username]);

            if (checkIfAdmin.rows.length !== 0) {

                results = await client.query(`
                                SELECT user_api.apikey
                                FROM users, user_api
                                WHERE users.id = $1
                                AND users.id = user_api.user_id
                                AND user_api.apikey IS NOT null`,
                    [giveAPIUserAccess]);

                if (results.rows.length === 0) {
                    const randomNum = Math.floor(Math.random() * 99999) + giveAPIUserAccess;
                    let generatedAPIKey = giveAPIUserAccess.toString() + randomNum.toString();
                    generatedAPIKey = parseInt(generatedAPIKey);
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
    // End of giveUserAPIAccess function

    // remove user API Access
    async removeUserAPIAccess(username, removeAPIUserAccess) {
        const client = new pg.Client(this.credentials);
        let results = false;
        try {
            await client.connect();

            const checkIfAdmin = await client.query(`
                                SELECT username
                                FROM users
                                WHERE username = $1
                                AND isadmin = true`,
                [username]);

            if (checkIfAdmin.rows.length !== 0) {

                results = await client.query(`
                                SELECT user_api.apikey
                                FROM users, user_api
                                WHERE users.id = $1
                                AND users.id = user_api.user_id
                                AND user_api.apikey IS NOT null`,
                    [removeAPIUserAccess]);

                if (results.rows.length !== 0) {

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
    // End of removeUserAPIAccess function

    /// -------------------- End of Admin -------------------- ///


    /// -------------------- API Routes -------------------- ///

    // getWorkoutPlanAPI
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
                            WHERE trainingsplit_id = $1`,
                                    [activetrainingsplit]);

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
    // End of getWorkoutPlanAPI function

    // getTotalPBAPI
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
    // End of getTotalPBAPI function

    // getLiftsAPI
    async getLiftsAPI(user, key) {

        const client = new pg.Client(this.credentials);
        let results = false;
        let msg = "";
        let userDetails = {};
        let userLifts = {};

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
                msg = "API Key er feil!";

            } else {

                results = await client.query(`
SELECT publicprofile
FROM user_settings
WHERE user_id = $1`,
                    [user]);

                if (results.rows.length === 0) {
                    results = false;
                    msg = "Brukeren finnes ikke!";
                } else {
                    const userHasPublicProfile = results.rows[0].publicprofile;

                    if (userHasPublicProfile === true) {

                        results = await client.query(`
SELECT username, displayname
FROM users
WHERE id = $1`, [user]);

                        if (results.rows.length !== 0) {

                            userDetails = results.rows[0];

                            results = await client.query(`
SELECT *
FROM user_lifts
WHERE user_id = $1`, [user]);

                            if (results.rows.length !== 0) {

                                delete results.rows[0].user_id;
                                userLifts = results.rows[0];

                                results = true;

                            }
                        }
                    } else {
                        results = false;
                        msg = "Brukeren har privat profil!";
                    }
                }
            }

            client.end();

        } catch (err) {
            results = false;
            client.end();
            console.log(err);
        }

        client.end();

        return { "status": results, "msg": { "error": msg }, "userDetails": userDetails, "userLifts": userLifts };
    }
    // End of getLiftsAPI function

    /// -------------------- End of API Routes -------------------- ///

}

module.exports = new StorageHandler(dbCredentials);