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

async function deleteAccount(userid, password) {
    try {
        password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex');
        const resp = await database.deleteAccount(userid, password);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function giveUserAPIAccess(userid, giveAPIUserAccess) {
    try {
        const resp = await database.giveUserAPIAccess(userid, giveAPIUserAccess);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function removeUserAPIAccess(userid, removeAPIUserAccess) {
    try {
        const resp = await database.removeUserAPIAccess(userid, removeAPIUserAccess);
        return resp;
    } catch (error) {
        console.error(error);
    }
}


async function updateUserSetting(userid, setting, value) {
    try {
        const resp = await database.updateUserSetting(userid, setting, value);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function updateDisplayname(userid, newDisplayname) {
    try {
        const resp = await database.updateDisplayname(userid, newDisplayname);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function updateUsername(userid, newUsername) {
    try {
        const resp = await database.updateUsername(userid, newUsername);
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

async function updateAboutMe(userid, settings) {
    try {
        const resp = await database.updateAboutMe(userid, settings);
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