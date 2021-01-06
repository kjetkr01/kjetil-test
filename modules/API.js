const database = require("./datahandler")

async function getWorkoutPlanAPI(user, password) {
    try {
        const resp = await database.getWorkoutPlanAPI(user, password);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

module.exports.getWorkoutPlanAPI = getWorkoutPlanAPI;