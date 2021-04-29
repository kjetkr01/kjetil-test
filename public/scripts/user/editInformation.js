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

                const daysSinceAndDate = getDaysSinceAndDate(lift.date);

                inp3.innerHTML = `${daysSinceAndDate.fixedDate}<br>${daysSinceAndDate.daysSinceMsg}`;

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

                const daysSinceAndDate = getDaysSinceAndDate(goal.date);

                inp3.innerHTML = `${daysSinceAndDate.fixedDate}<br>${daysSinceAndDate.daysSinceMsg}`;

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