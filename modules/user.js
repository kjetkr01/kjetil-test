const database = require("./datahandler")
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

async function getListOfUsers() {
    try {
        const resp = await database.getListOfAllUsers();
        return resp;
    } catch (error) {
        console.error(error);
    }
}

module.exports = User;
module.exports.validateUser = validateUser;
module.exports.getListOfUsers = getListOfUsers;