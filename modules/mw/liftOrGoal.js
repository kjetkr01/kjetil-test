const database = require("../datahandler");

async function saveLiftOrGoal(userid, info, color) {
    try {
        const resp = await database.saveLiftOrGoal(userid, info, color);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function setGoalAsComplete(userid, completedGoalsList) {
    try {
        const resp = await database.setGoalAsComplete(userid, completedGoalsList);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function deleteLiftOrGoal(userid, info) {
    try {
        const resp = await database.deleteLiftOrGoal(userid, info);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

module.exports.saveLiftOrGoal = saveLiftOrGoal;
module.exports.setGoalAsComplete = setGoalAsComplete;
module.exports.deleteLiftOrGoal = deleteLiftOrGoal;