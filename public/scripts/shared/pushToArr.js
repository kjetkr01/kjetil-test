"use strict";

// pushToArrPerExerciseLift
function pushToArrPerExerciseLift(aExerciseLift, aCurrent, aArr) {

    let msg = "";

    const arr = aArr;
    const exerciseLift = aExerciseLift;
    const current = aCurrent;
    const exerciseLiftKeys = Object.keys(exerciseLift);

    for (let j = 0; j < exerciseLiftKeys.length; j++) {

        const liftKeys = exerciseLift[exerciseLiftKeys[j]];

        if (liftKeys) {

            const id = liftKeys.id;
            const color = liftKeys.color || "redBadgeG";

            if (liftKeys.reps === "1") {
                msg = `ORM / 1 rep`;
            } else {
                msg = `${liftKeys.reps} reps`;
            }

            arr.push({ "exercise": capitalizeFirstLetter(current), "kg": liftKeys.kg, "msg": msg, "color": color, "id": id });

        }
    }
}
// End of pushToArrPerExerciseLift function

// pushToArrPerExerciseGoal
function pushToArrPerExerciseGoal(aExerciseGoal, aCurrent, aCheckIfCompleted, aCompletedGoalsList, aArr) {

    let kgUntilGoal = 0, repsUntilGoal = 0, msg = "", progressionPercent = 0;

    const checkIfCompleted = aCheckIfCompleted;
    const completedGoalsList = aCompletedGoalsList;
    const arr = aArr;
    const exerciseGoal = aExerciseGoal;
    const current = aCurrent;
    const exerciseGoalKeys = Object.keys(exerciseGoal);

    for (let j = 0; j < exerciseGoalKeys.length; j++) {

        const goalKeys = exerciseGoal[exerciseGoalKeys[j]];

        if (goalKeys) {

            const id = goalKeys.id;
            const color = goalKeys.color || "redBadgeG";
            const goalKg = parseFloat(goalKeys.kg);

            if (goalKeys.completed !== true) {

                if (current.includes("i vekt")) {

                    const calcWeight = user.getDetail("weight");

                    if (calcWeight) {

                        if (current.includes("opp i vekt")) {

                            kgUntilGoal = goalKg - calcWeight;
                            if (kgUntilGoal <= 0) {
                                msg = "Målet er nådd!";
                            } else {
                                msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                calcPercent(calcWeight, goalKg);
                            }
                        } else {

                            kgUntilGoal = calcWeight - goalKg;
                            if (kgUntilGoal <= 0) {
                                msg = "Målet er nådd!";
                            } else {
                                msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                calcPercent(goalKg, calcWeight);
                            }
                        }

                    } else {
                        msg = "Din vekt kreves";
                    }

                } else {

                    const goalReps = parseInt(goalKeys.reps);
                    const liftKeys = Object.keys(lifts[current]);

                    let highestLiftKg = { "kg": 0, "reps": 0 };

                    const liftsList = {};

                    for (let f = 0; f < liftKeys.length; f++) {
                        const lift = lifts[current][f];
                        const liftReps = parseInt(lift.reps);
                        const liftKg = parseFloat(lift.kg);

                        liftsList[liftKg] = liftReps;

                        if (highestLiftKg.kg < liftKg) {
                            highestLiftKg.kg = liftKg;
                            highestLiftKg.reps = liftReps;
                        }

                        if (highestLiftKg.kg === goalKg) {
                            repsUntilGoal = goalReps - highestLiftKg.reps;

                            if (repsUntilGoal <= 0) {
                                msg = "Målet er nådd!";
                            } else if (repsUntilGoal === 1) {
                                msg = `1 rep igjen`;
                                calcPercent(highestLiftKg.reps, goalReps);
                            } else {
                                msg = `${repsUntilGoal} reps igjen`;
                                calcPercent(highestLiftKg.reps, goalReps);
                            }
                        } else {
                            kgUntilGoal = goalKg - highestLiftKg.kg;
                            if (kgUntilGoal <= 0) {
                                msg = "Målet er nådd!";
                            } else {
                                msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                calcPercent(highestLiftKg.kg, goalKg);
                            }
                        }
                    }

                    if (highestLiftKg.kg >= goalKg) {
                        if (liftsList[goalKg]) {
                            repsUntilGoal = goalReps - liftsList[goalKg];
                            if (repsUntilGoal <= 0) {
                                msg = "Målet er nådd!";
                            } else if (repsUntilGoal === 1) {
                                msg = `1 rep igjen`;
                                calcPercent(liftsList[goalKg], goalReps);
                            } else {
                                msg = `${repsUntilGoal} reps igjen`;
                                calcPercent(liftsList[goalKg], goalReps);
                            }
                        } else if (highestLiftKg.reps >= goalReps && highestLiftKg.kg >= goalKg) {
                            msg = "Målet er nådd!";
                        } else {
                            msg = `${goalReps} reps igjen`;
                            calcPercent(liftsList[goalKg], goalReps);
                        }
                    } else {
                        kgUntilGoal = goalKg - highestLiftKg.kg;
                        msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                        calcPercent(highestLiftKg.kg, goalKg);
                    }
                }


                function calcPercent(aNum1, aNum2) {
                    const num1 = aNum1 || 0;
                    const num2 = aNum2 || 0;

                    progressionPercent = Math.floor((num1 / num2) * 100);
                }

                function checkIfDecimal(aNum) {
                    let num = aNum;
                    const checkIfDecimal = num.toString().split(".");
                    if (checkIfDecimal.length > 1) {
                        if (checkIfDecimal[1].length === 1) {
                            num = parseFloat(num).toFixed(1);
                        } else {
                            num = parseFloat(num).toFixed(2);
                        }
                    }
                    return num;
                }

                if (msg === "Målet er nådd!") {
                    progressionPercent = 100;
                }

                if (progressionPercent < 0) {
                    progressionPercent = 0;
                }
                if (progressionPercent > 100) {
                    progressionPercent = 100;
                }

                if (progressionPercent === 100) {
                    if (checkIfCompleted === true) {
                        if (goalKeys.completed !== true) {
                            if (!completedGoalsList[current]) {
                                completedGoalsList[current] = [];
                            }
                            completedGoalsList[current].push(id);
                        }
                    }
                }

            } else {
                progressionPercent = 100;
                msg = "Målet er nådd!";
            }

            arr.push({ "exercise": capitalizeFirstLetter(current), "kg": goalKg, "msg": msg, "color": color, "id": id, "progressionPercent": progressionPercent });

        }
    }
}
// End of pushToArrPerExerciseGoal function

// pushToArrActiveTrainingsplit
function pushToArrActiveTrainingsplit(aActiveTrainingsplit, aKeys, aArr) {

    const activetrainingsplit = aActiveTrainingsplit;
    const keys = aKeys;
    const arr = aArr;

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const daysNorwegian = {
        "sunday": "Søndag",
        "monday": "Mandag",
        "tuesday": "Tirsdag",
        "wednesday": "Onsdag",
        "thursday": "Torsdag",
        "friday": "Fredag",
        "saturday": "Lørdag",
    }

    const dayNum = new Date().getDay();
    const day = days[dayNum];
    for (let i = 0; i < keys.length; i++) {

        if (days.includes(keys[i]) && daysNorwegian[keys[i]]) {
            let activeTrainingsplitKeys = activetrainingsplit[keys[i]];
            if (activeTrainingsplitKeys.short.length > 0) {
                let color = "trainingsplit_defaultBadgeG";
                if (keys[i] === day) {
                    color = "trainingsplit_todayBadgeG";
                }
                arr.push({ "day": daysNorwegian[keys[i]], "trainingsplit": activeTrainingsplitKeys.short, "color": color, "trainingsplit_id": activetrainingsplit.trainingsplit_id });
            }
        }
    }
}
// End of pushToArrActiveTrainingsplit function