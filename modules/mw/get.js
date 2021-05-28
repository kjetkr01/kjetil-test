const database = require("../datahandler");

async function getListOfUsers(username) {
    try {
        const resp = await database.getListOfAllUsers(username);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getListOfLeaderboards(reps) {
    try {
        const resp = await database.getListOfLeaderboards(reps);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getListOfUsersLeaderboard(leaderboard, reps) {
    try {
        const resp = await database.getListOfUsersLeaderboard(leaderboard, reps);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getListOfPendingUsers(username, onlyNumbers) {
    try {
        const resp = await database.getListOfPendingUsers(username, onlyNumbers);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getUserDetails(viewingUser, userID) {
    try {
        const resp = await database.getUserDetails(viewingUser, userID);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getUserSettingsAndInfo(username) {
    try {
        const resp = await database.getUserSettingsAndInfo(username);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getListOfAllUsersWorkoutToday(dayTxt) {
    try {
        const resp = await database.getListOfAllUsersWorkoutToday(dayTxt);
        return resp;
    } catch (error) {
        console.error(error);
    }
}


async function getAllUserInformation(user) {
    try {
        const resp = await database.getAllUserInformation(user);
        return resp;
    } catch (error) {
        console.error(error);
    }
}


module.exports.getListOfUsers = getListOfUsers;
module.exports.getListOfLeaderboards = getListOfLeaderboards;
module.exports.getListOfUsersLeaderboard = getListOfUsersLeaderboard;
module.exports.getListOfPendingUsers = getListOfPendingUsers;
module.exports.getUserDetails = getUserDetails;
module.exports.getUserSettingsAndInfo = getUserSettingsAndInfo;
module.exports.getListOfAllUsersWorkoutToday = getListOfAllUsersWorkoutToday;
module.exports.getAllUserInformation = getAllUserInformation;