const database = require("./datahandler");

async function getListOfUsers(username) {
    try {
        const resp = await database.getListOfAllUsers(username);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getListOfLeaderboards() {
    try {
        const resp = await database.getListOfLeaderboards();
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getListOfUsersLeaderboard(leaderboard) {
    try {
        const resp = await database.getListOfUsersLeaderboard(leaderboard);
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

async function getWorkoutSplit(username) {
    try {
        const resp = await database.getWorkoutSplit(username);
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
module.exports.getWorkoutSplit = getWorkoutSplit;
module.exports.getUserDetails = getUserDetails;
module.exports.getUserSettingsAndInfo = getUserSettingsAndInfo;
module.exports.getListOfAllUsersWorkoutToday = getListOfAllUsersWorkoutToday;
module.exports.getAllUserInformation = getAllUserInformation;