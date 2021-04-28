let lifts = null, goals = null, size = 0, badgeColorsJSON = null;;

function displayPartOfDayMsg() {

    if (userDisplayname) {
        const partOfDayMsg = partOfDayMessage(userDisplayname);
        const titleDom = document.getElementById("title");
        const nameDom = document.getElementById("name");

        if (partOfDayMsg.message && partOfDayMsg.firstName) {
            titleDom.textContent = partOfDayMsg.message;
            nameDom.textContent = partOfDayMsg.firstName;
        } else {
            titleDom.textContent = partOfDayMsg.message;
        }
    }

}


async function checkWhoIsWorkingOutToday() {

    const peopleWorkoutList = document.getElementById("peopleWorkoutList");
    const peopleWorkoutTxt = document.getElementById("peopleWorkoutTxt");

    peopleWorkoutList.innerHTML = "";
    peopleWorkoutTxt.innerHTML = "";

    const cached_peopleWorkoutTxt = localStorage.getItem("cached_peopleWorkoutTxt");
    if (cached_peopleWorkoutTxt) {
        peopleWorkoutTxt.classList = "noselect";
        peopleWorkoutTxt.innerHTML = cached_peopleWorkoutTxt;
    }

    currentDayInfo();

    const resp = await whoIsWorkingOutToday();

    if (resp.length > 0) {

        if (resp.length === 1) {
            peopleWorkoutTxt.innerHTML = `I dag trener ${resp.length} person`;
        } else {
            peopleWorkoutTxt.innerHTML = `I dag trener ${resp.length} personer`;
        }

        resp.sort(function (a, b) {
            if (a.todaysWorkout < b.todaysWorkout) {
                return -1;
            }
            if (a.todaysWorkout > b.todaysWorkout) {
                return 1;
            }
            return 0;
        });

        let currentWorkout = "";

        for (let i = 0; i < resp.length; i++) {
            let splitFullName = resp[i].userFullName.split(" ");
            let shortenedFullName = "";

            if (currentWorkout !== resp[i].todaysWorkout) {
                peopleWorkoutList.innerHTML += `
               <button disabled class="peopleWorkoutListWorkout fadeIn">${resp[i].todaysWorkout}</button>
               <br>
               `;

                currentWorkout = resp[i].todaysWorkout;
            }

            shortenedFullName = splitFullName[0] + " ";
            for (let j = 1; j < splitFullName.length; j++) {
                shortenedFullName += `${splitFullName[j][0]}.`;
            }

            if (userID === resp[i].id) {

                peopleWorkoutList.innerHTML += `
                <button class="accountOwner fadeInUp animate pointer" onClick="viewUser('${resp[i].id}')">${shortenedFullName}</button>
                <br>
                `;

            } else {

                peopleWorkoutList.innerHTML += `
            <button class="peopleWorkoutListName fadeInUp animate pointer" onClick="viewUser('${resp[i].id}')">${shortenedFullName}</button>
            <br>
            `;

            }

        }

    } else {
        peopleWorkoutTxt.innerHTML = `I dag er det ingen som trener`;
    }

    localStorage.setItem("cached_peopleWorkoutTxt", peopleWorkoutTxt.innerHTML);

}


function currentDayInfo() {

    const todayDom = document.getElementById("today");

    const todayDate = new Date();
    const option = { weekday: "long", month: "long", day: "numeric" };
    todayDate.toLocaleDateString("no-NB", option);

    let dateFormat = todayDate.toLocaleDateString("no-NB", option);

    let splitDateFormat = dateFormat.split(" ");

    let fixedDateFormat = "";

    for (let i = 0; i < splitDateFormat.length; i++) {

        function upperCaseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function lowerCaseAllWordsExceptFirstLetters(string) {
            return string.replace(/\S*/g, function (word) {
                return word.charAt(0) + word.slice(1).toLowerCase();
            });
        }

        fixedDateFormat += upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(splitDateFormat[i])) + " ";

    }

    fixedDateFormat = fixedDateFormat.split(" ");

    if (fixedDateFormat[0] && fixedDateFormat[1] && fixedDateFormat[2]) {
        todayDom.textContent = `${fixedDateFormat[0]} ${fixedDateFormat[1]} ${fixedDateFormat[2]}`;
    } else {
        todayDom.textContent = dateFormat;
    }



}

// requestAccountDetails

async function requestAccountDetails() {

    try {
        lifts = JSON.parse(localStorage.getItem("cachedLifts_owner"));
        goals = JSON.parse(localStorage.getItem("cachedGoals_owner"));
        badgeColorsJSON = JSON.parse(localStorage.getItem("cachedBadgeColors"));

        if (goals && lifts) {
            goalsInfo = new Tgoals(goals);
            document.getElementById("smallTitle").classList = "noselect";
            showGoalBadgeAnimations = false;
            displayGoals();
        }

        if (badgeColorsJSON) {
            badgeColors = new TbadgeColors(badgeColorsJSON);
        }

    } catch {
        localStorage.removeItem("cacheDetails_owner");
        localStorage.removeItem("cachedLifts_owner");
        localStorage.removeItem("cachedHasLiftsLeft_owner");
        localStorage.removeItem("cachedGoals_owner");
        localStorage.removeItem("cachedHasGoalsLeft_owner");
    }

    const resp = await getAccountDetails(userID);

    if (resp) {
        if (resp.hasOwnProperty("info")) {
            localStorage.setItem("cachedLifts_owner", JSON.stringify(resp.info.lifts));
            localStorage.setItem("cachedHasLiftsLeft_owner", resp.info.liftsLeft > 0);
            localStorage.setItem("cachedGoals_owner", JSON.stringify(resp.info.goals));
            localStorage.setItem("cachedHasGoalsLeft_owner", resp.info.goalsLeft > 0);
            displayBadges(resp.info);
            return;
        }
    }

    //alert("Det har oppstått en feil!");
    //redirectToFeed();
}

// end of requestAccountDetails

async function displayBadges(aInfo) {

    if (!aInfo) {
        return;
    }

    const info = aInfo;
    size = 0//info.settings.badgesize || 0;

    if (size === 1) {
        document.getElementById("Gbadges").style.minHeight = "200px";
    }

    let updateGoals = true, updateBadgeColors = true;

    try {

        const checkExistingLifts = JSON.stringify(lifts);
        const checkUpdatedLifts = JSON.stringify(info.lifts);

        const checkExistingGoals = JSON.stringify(goals);
        const checkUpdatedGoals = JSON.stringify(info.goals);

        const checkExistingBadgeColors = JSON.stringify(badgeColorsJSON);
        const checkUpdatedBadgeColors = JSON.stringify(info.badgeColors);

        if (checkExistingLifts === checkUpdatedLifts && checkExistingGoals === checkUpdatedGoals) {
            updateGoals = false;
            console.log("skipped update lifts/goals");
        }

        if (checkExistingBadgeColors === checkUpdatedBadgeColors) {
            updateBadgeColors = false;
            console.log("skipped update badgeColors");
        }

    } catch {

    }

    if (updateBadgeColors === true) {
        badgeColors = new TbadgeColors(info.badgeColors);
    }

    if (updateGoals === true) {
        lifts = info.lifts;
        goals = info.goals;
        showGoalBadgeAnimations = true;
    }

    goalsLeft = new TgoalsLeft(info.goalsLeft);
    badgeColors = new TbadgeColors(info.badgeColors);

    if (updateGoals === true) {
        goalsInfo = new Tgoals(info.goals);
        displayGoals();
    }

}

function displayGoals() {

    hasGoalsLeft = localStorage.getItem("cachedHasGoalsLeft_owner") === "true" || false;

    const smallTitle = document.getElementById("smallTitle");

    const badgesTableRowDom = document.getElementById("badgesTableRow");
    badgesTableRowDom.innerHTML = "";

    const keys = Object.keys(goals);

    const arr = [];

    for (let i = 0; i < keys.length; i++) {

        let kgUntilGoal = 0, msg = "";

        const exerciseGoal = goals[keys[i]];
        const exerciseGoalKeys = Object.keys(exerciseGoal);

        for (let j = 0; j < exerciseGoalKeys.length; j++) {

            const goalKeys = exerciseGoal[exerciseGoalKeys[j]];

            if (goalKeys) {

                const id = goalKeys.id;
                const color = goalKeys.color || "redBadgeG";
                const goalReps = parseInt(goalKeys.reps);
                const goalKg = parseFloat(goalKeys.kg);

                let currentLiftPR = 0;

                const liftKeys = Object.keys(lifts[keys[i]]);

                for (let f = 0; f < liftKeys.length; f++) {
                    const lift = lifts[keys[i]][f];
                    const liftReps = parseInt(lift.reps);
                    const liftKg = parseFloat(lift.kg);

                    if (liftKg === goalKg) {
                        repsUntilGoal = goalReps - liftReps;

                        if (repsUntilGoal <= 0) {
                            msg = "Målet er nådd!";
                        } else if (repsUntilGoal === 1) {
                            msg = `1 rep igjen`;
                        } else {
                            msg = `${repsUntilGoal} reps igjen`;
                        }

                    } else {
                        currentLiftPR = liftKg;
                        kgUntilGoal = goalKg - currentLiftPR;
                        if (kgUntilGoal <= 0) {
                            msg = "Målet er nådd!";
                        } else {
                            msg = `${kgUntilGoal} kg igjen`;
                        }
                    }
                }

                arr.push({ "exercise": capitalizeFirstLetter(keys[i]), "kg": goalKg, "kgLeft": kgUntilGoal, "msg": msg, "color": color, "id": id });

            }
        }

    }

    arr.sort(function (a, b) { return a.kgLeft - b.kgLeft });

    if (arr.length > 0) {
        smallTitle.textContent = "Din fremgang";
    } else {
        smallTitle.textContent = "Du har ingen mål enda!";
    }

    for (let i = 0; i < arr.length; i++) {

        const badge = getBadgeGoals(size, arr[i], arr[i].id);

        if (badge && badgesTableRowDom) {
            badgesTableRowDom.innerHTML += badge;
        }
    }

    if (hasGoalsLeft === true || Object.entries(goals).length === 0) {

        const badge = getBadgeGoals();

        if (badge && badgesTableRowDom) {
            badgesTableRowDom.innerHTML += badge;
        }
    }
}
