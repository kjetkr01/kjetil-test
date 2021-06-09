const database = require("../datahandler");
const crypto = require('crypto');
const secret = process.env.hashSecret || require("../../localenv").hashSecret;

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
        password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        const resp = await database.validateUser(username, password);
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

async function decreaseMedalCount(userid, count) {
    try {
        const resp = await database.decreaseMedalCount(userid, count);
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


async function updateUserSetting(username, setting, value) {
    try {
        const resp = await database.updateUserSetting(username, setting, value);
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

module.exports = User;
module.exports.validateUser = validateUser;
module.exports.acceptOrDenyUser = acceptOrDenyUser;
module.exports.decreaseMedalCount = decreaseMedalCount;
module.exports.deleteAccount = deleteAccount;
module.exports.giveUserAPIAccess = giveUserAPIAccess;
module.exports.removeUserAPIAccess = removeUserAPIAccess;

module.exports.updateUserSetting = updateUserSetting;
module.exports.updateDisplayname = updateDisplayname;
module.exports.updateUsername = updateUsername;
module.exports.updatePassword = updatePassword;
module.exports.updateAboutMe = updateAboutMe;