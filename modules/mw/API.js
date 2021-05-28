const database = require("../datahandler");

async function getWorkoutPlanAPI(user, key) {
    try {
        const resp = await database.getWorkoutPlanAPI(user, key);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getTotalPBAPI(user, key) {
    try {
        const resp = await database.getTotalPBAPI(user, key);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getLiftsAPI(user, key) {
    try {
        const resp = await database.getLiftsAPI(user, key);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

module.exports.getWorkoutPlanAPI = getWorkoutPlanAPI;
module.exports.getTotalPBAPI = getTotalPBAPI;
module.exports.getLiftsAPI = getLiftsAPI;