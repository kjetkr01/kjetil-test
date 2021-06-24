const database = require("../datahandler");

async function createTrainingsplit(userid) {
    try {
        const resp = await database.createTrainingsplit(userid);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function deleteTrainingsplit(userid, trainingsplit_id) {
    try {
        const resp = await database.deleteTrainingsplit(userid, trainingsplit_id);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function saveTrainingsplit(userid, trainingsplit_id, day, list, trainingsplit_name, trainingsplit_short) {
    try {
        const resp = await database.saveTrainingsplit(userid, trainingsplit_id, day, list, trainingsplit_name, trainingsplit_short);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getTrainingsplit(userid, trainingsplit_id) {
    try {
        const resp = await database.getTrainingsplit(userid, trainingsplit_id);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getTrainingsplitSubscriberCount(trainingsplit_id) {
    try {
        const resp = await database.getTrainingsplitSubscriberCount(trainingsplit_id);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function getAllTrainingsplits() {
    try {
        const resp = await database.getAllTrainingsplits();
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function copyTrainingsplit(userid, trainingsplit_id, owner_id) {
    try {
        const resp = await database.copyTrainingsplit(userid, trainingsplit_id, owner_id);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function subUnsubTrainingsplit(userid, trainingsplit_id, owner_id) {
    try {
        const resp = await database.subUnsubTrainingsplit(userid, trainingsplit_id, owner_id);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function setActiveTrainingsplit(userid, trainingsplit_id) {
    try {
        const resp = await database.setActiveTrainingsplit(userid, trainingsplit_id);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function setNotActiveTrainingsplit(userid) {
    try {
        const resp = await database.setNotActiveTrainingsplit(userid);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function changeTrainingsplitVisibility(userid, trainingsplit_id, value) {
    try {
        const resp = await database.changeTrainingsplitVisibility(userid, trainingsplit_id, value);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function addExerciseTrainingsplit(userid, trainingsplit_id, exercise, day) {
    try {
        const resp = await database.addExerciseTrainingsplit(userid, trainingsplit_id, exercise, day);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function deleteExerciseTrainingsplit(userid, trainingsplit_id, exercise, day) {
    try {
        const resp = await database.deleteExerciseTrainingsplit(userid, trainingsplit_id, exercise, day);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function changeExerciseOrderTrainingsplit(userid, trainingsplit_id, day, index, moveUp) {
    try {
        const resp = await database.changeExerciseOrderTrainingsplit(userid, trainingsplit_id, day, index, moveUp);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function addExerciseRowTrainingsplit(userid, trainingsplit_id, exercise, day) {
    try {
        const resp = await database.addExerciseRowTrainingsplit(userid, trainingsplit_id, exercise, day);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

async function deleteExerciseRowTrainingsplit(userid, trainingsplit_id, exercise, index, day) {
    try {
        const resp = await database.deleteExerciseRowTrainingsplit(userid, trainingsplit_id, exercise, index, day);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

module.exports.createTrainingsplit = createTrainingsplit;
module.exports.deleteTrainingsplit = deleteTrainingsplit;
module.exports.saveTrainingsplit = saveTrainingsplit;
module.exports.getTrainingsplit = getTrainingsplit;
module.exports.getTrainingsplitSubscriberCount = getTrainingsplitSubscriberCount;
module.exports.getAllTrainingsplits = getAllTrainingsplits;
module.exports.copyTrainingsplit = copyTrainingsplit;
module.exports.subUnsubTrainingsplit = subUnsubTrainingsplit;
module.exports.setActiveTrainingsplit = setActiveTrainingsplit;
module.exports.setNotActiveTrainingsplit = setNotActiveTrainingsplit;
module.exports.changeTrainingsplitVisibility = changeTrainingsplitVisibility;
module.exports.addExerciseTrainingsplit = addExerciseTrainingsplit;
module.exports.deleteExerciseTrainingsplit = deleteExerciseTrainingsplit;
module.exports.changeExerciseOrderTrainingsplit = changeExerciseOrderTrainingsplit;
module.exports.addExerciseRowTrainingsplit = addExerciseRowTrainingsplit;
module.exports.deleteExerciseRowTrainingsplit = deleteExerciseRowTrainingsplit;