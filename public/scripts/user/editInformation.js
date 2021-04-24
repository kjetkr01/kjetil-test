let liftsLeft = null, goalsLeft = null, liftsInfo = null, goalsInfo = null, badgeColors = null, traningsplitInfo = null;

function enableOverlayView(aType, aExercise, aId) {

    if (aType && aExercise) {

        const type = aType;
        const exercise = aExercise.toLowerCase();
        const exerciseCapitalizedFirst = capitalizeFirstLetter(exercise);
        const id = aId;
        const viewLiftorGoal = document.getElementById("viewLiftorGoal");
        const title1 = document.getElementById("title1E");
        const inp1 = document.getElementById("inp1E");
        const inp2 = document.getElementById("inp2E");
        const inp3 = document.getElementById("inp3E");
        const inp4 = document.getElementById("inp4E");

        const viewLiftorGoalOverlay = document.getElementById("viewLiftorGoalOverlay");
        viewLiftorGoal.style.border = "";

        if (type === "goal") {
            title1.textContent = exerciseCapitalizedFirst + " (mål)";
        } else {
            title1.textContent = exerciseCapitalizedFirst + " (løft)";
        }

        title1.value = exercise;

        inp1.value = "";
        inp2.value = "";
        inp3.value = "";
        inp4.innerHTML = "";

        const today = new Date().toISOString().substr(0, 10) || null;

        if (today) {
            inp3.setAttribute('max', today);
        }

        if (type === "lift" && liftsInfo) {

            const lifts = liftsInfo.info();
            const badgeColorsInfo = badgeColors.info();
            const badgeColorsValues = Object.entries(badgeColorsInfo);

            let lift = lifts[exercise];

            function findWithAttr(value) {
                for (var i = 0; i < lift.length; i += 1) {
                    if (lift[i].id === value) {
                        return i;
                    }
                }
                return -1;
            }

            const index = findWithAttr(id);

            if (index >= 0) {
                lift = lifts[exercise][index];
            }

            if (lift) {
                inp1.innerHTML = lift.kg;
                inp2.innerHTML = lift.reps;

                const prDateArr = lift.date.split("-");
                let daysSinceTxt = "";

                let date = "";

                if (prDateArr.length === 3) {

                    if (prDateArr[0].length === 4 && prDateArr[1] > 0 && prDateArr[1] <= 12 && prDateArr[1].length <= 2 && prDateArr[2] > 0 && prDateArr[2] <= 31 && prDateArr[2].length <= 2) {

                        const d = new Date();
                        const prDate = new Date(prDateArr[0], (prDateArr[1] - 1), prDateArr[2]);

                        date = getDateFormat(prDateArr[2], prDateArr[1], prDateArr[0]);

                        const daysSinceTime = parseInt((d - prDate) / (1000 * 3600 * 24));

                        if (d < prDate) {
                            //fremtiden
                        } else if (daysSinceTime > 1) {
                            daysSinceTxt = `${parseInt(daysSinceTime)} dager siden`;
                        } else if (daysSinceTime === 1) {
                            daysSinceTxt = `I går`;
                        } else if (daysSinceTime === 0) {
                            daysSinceTxt = `I dag`;
                        }
                    }
                }

                inp3.innerHTML = `${date}<br>${daysSinceTxt}`;

                const color = lift.color;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    if (badgeColorsValues[i][0] === color) {
                        inp4.innerHTML = `${badgeColorsValues[i][1]}`;
                    }
                }

                if (badgeColorBorders.hasOwnProperty(color)) {
                    document.getElementById("viewLiftorGoal").style.border = `1px solid #${badgeColorBorders[color]}`;
                }

                viewLiftorGoalOverlay.style.display = "block";

            } else {
                alert("Det har oppstått et problem!");
            }

        } else if (type === "goal" && goalsInfo) {
            const goals = goalsInfo.info();
            const badgeColorsInfo = badgeColors.info();
            const badgeColorsValues = Object.entries(badgeColorsInfo);

            let goal = goals[exercise];

            function findWithAttr(value) {
                for (var i = 0; i < goal.length; i += 1) {
                    if (goal[i].id === value) {
                        return i;
                    }
                }
                return -1;
            }

            const index = findWithAttr(id);

            if (index >= 0) {
                goal = goals[exercise][index];
            }

            if (goal) {
                inp1.innerHTML = goal.kg;
                inp2.innerHTML = goal.reps;
                inp3.innerHTML = goal.date;

                const color = goal.color;

                for (let i = 0; i < badgeColorsValues.length; i++) {
                    if (badgeColorsValues[i][0] === color) {
                        inp4.innerHTML = `${badgeColorsValues[i][1]}`;
                    }
                }

                if (badgeColorBorders.hasOwnProperty(color)) {
                    document.getElementById("viewLiftorGoal").style.border = `1px solid #${badgeColorBorders[color]}`;
                }

                viewLiftorGoalOverlay.style.display = "block";

            } else {
                alert("Det har oppstått et problem!");
            }

        } else {
            alert(`Det har oppstått en feil: "${aType}" finnes ikke!`);
        }
    }
}

function TliftsLeft(aLiftsLeft) {
    const liftsLeftInfo = aLiftsLeft;

    this.info = function () {
        return liftsLeftInfo;
    }
}

function Tlifts(aLifts) {
    const liftsInfo = aLifts;

    this.info = function () {
        return liftsInfo;
    }
}

function Tgoals(aGoals) {
    const goalsInfo = aGoals;

    this.info = function () {
        return goalsInfo;
    }
}

function TgoalsLeft(aGoalsLeft) {
    const goalsLeftInfo = aGoalsLeft;

    this.info = function () {
        return goalsLeftInfo;
    }
}

function TbadgeColors(aBadgeColors) {
    const badgeColors = aBadgeColors;

    this.info = function () {
        return badgeColors;
    }
}

function Ttrainingsplit(aTrainingsplit) {
    const trainingsplit = aTrainingsplit;

    this.info = function () {
        return trainingsplit;
    }
}

function disableOverlay() {

    const createNewLiftorGoalOverlay = document.getElementById("createNewLiftorGoalOverlay");
    const viewLiftorGoalOverlay = document.getElementById("viewLiftorGoalOverlay");
    const editDaysOverlay = document.getElementById("editworkoutPlanOverlay");

    if (createNewLiftorGoalOverlay) {
        createNewLiftorGoalOverlay.style.display = "none";
    }

    if (viewLiftorGoalOverlay) {
        viewLiftorGoalOverlay.style.display = "none";
    }

    if (editDaysOverlay) {
        editDaysOverlay.style.display = "none";
    }
}