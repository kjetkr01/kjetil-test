const database = require("./datahandler");
const crypto = require('crypto');
const secret = process.env.hashSecret || require("../localenv").hashSecret;

class User {
    constructor(username, password, displayname) {
        this.username = username;
        this.password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        this.displayname = displayname;
        this.isValid = false;
    }

    async addToPendingList() {
        try {
            const resp = await database.addUserToPendingList(this.username, this.password, this.displayname);
            return resp;
        } catch (error) {
            console.error(error);
        }
    }

}

async function validateUser(username, password) {
    try {
        let isValid = false;
        password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        const resp = await database.validateUser(username, password);
        if (resp !== null) {
            isValid = true;
        }
        return { "isValid": isValid, "userInfo": resp };
    } catch (error) {
        console.error(error);
    }
}

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

async function acceptOrDenyUser(username, pendingUser, acceptOrDeny) {
    try {
        const resp = await database.acceptOrDenyUser(username, pendingUser, acceptOrDeny);
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

async function updateUserSetting(username, setting, value) {
    try {
        const resp = await database.updateUserSetting(username, setting, value);
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

async function saveLiftOrGoal(username, exercise, kg, date, type, color) {
    try {
        const resp = await database.saveLiftOrGoal(username, exercise, kg, date, type, color);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function deleteLiftOrGoal(username, exercise, type) {
    try {
        const resp = await database.deleteLiftOrGoal(username, exercise, type);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function updateTrainingDays(trainingDays, username) {
    try {
        const resp = await database.updateTrainingDays(trainingDays, username);
        return resp;
    } catch (error) {
        console.error(error);
    }
}


async function updateDisplayname(username, newDisplayname) {
    try {
        const resp = await database.updateDisplayname(username, newDisplayname);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function updateUsername(username, newUsername) {
    try {
        const resp = await database.updateUsername(username, newUsername);
        return resp;
    } catch (error) {
        console.error(error);
    }
}


async function updatePassword(user, exsistingPsw, newPsw) {
    try {
        exsistingPsw = crypto.createHmac('sha256', secret)
            .update(exsistingPsw)
            .digest('hex');
        newPsw = crypto.createHmac('sha256', secret)
            .update(newPsw)
            .digest('hex');
        const resp = await database.updatePassword(user, exsistingPsw, newPsw);
        return resp;
    } catch (error) {
        console.error(error);
    }
}


async function updateAboutMe(username, settings) {
    try {
        const resp = await database.updateAboutMe(username, settings);
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


async function deleteAccount(username, password) {
    try {
        password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        const resp = await database.deleteAccount(username, password);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function giveUserAPIAccess(username, giveAPIUserAccess) {
    try {
        const resp = await database.giveUserAPIAccess(username, giveAPIUserAccess);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function removeUserAPIAccess(username, removeAPIUserAccess) {
    try {
        const resp = await database.removeUserAPIAccess(username, removeAPIUserAccess);
        return resp;
    } catch (error) {
        console.error(error);
    }
}


module.exports = User;
module.exports.validateUser = validateUser;
module.exports.getListOfUsers = getListOfUsers;
module.exports.getListOfLeaderboards = getListOfLeaderboards;
module.exports.getListOfUsersLeaderboard = getListOfUsersLeaderboard;
module.exports.getListOfPendingUsers = getListOfPendingUsers;
module.exports.acceptOrDenyUser = acceptOrDenyUser;
module.exports.getWorkoutSplit = getWorkoutSplit;
module.exports.getUserDetails = getUserDetails;
module.exports.getUserSettingsAndInfo = getUserSettingsAndInfo;
module.exports.updateUserSetting = updateUserSetting;
module.exports.getListOfAllUsersWorkoutToday = getListOfAllUsersWorkoutToday;
module.exports.saveLiftOrGoal = saveLiftOrGoal;
module.exports.deleteLiftOrGoal = deleteLiftOrGoal;
module.exports.updateTrainingDays = updateTrainingDays;
module.exports.updateDisplayname = updateDisplayname;
module.exports.updateUsername = updateUsername;
module.exports.updatePassword = updatePassword;
module.exports.updateAboutMe = updateAboutMe;
module.exports.getAllUserInformation = getAllUserInformation;
module.exports.deleteAccount = deleteAccount;
module.exports.giveUserAPIAccess = giveUserAPIAccess;
module.exports.removeUserAPIAccess = removeUserAPIAccess;