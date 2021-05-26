// requestAccountDetails
let lifts = null;
let goals = null;
let activetrainingsplit = null;
let badgeColorsJSON = null;
let size = 0;
let memberSince = null;

function displayUserDetailsCached() {

    try {

        const cacheDetails = JSON.parse(localStorage.getItem("cachedDetails_owner"));

        if (cacheDetails.hasOwnProperty("displayname")) {
            const title = document.getElementById("title");
            title.classList = "noselect";
            title.textContent = cacheDetails.displayname;
        }
        if (cacheDetails.hasOwnProperty("gym")) {
            const gym = document.getElementById("gym");
            gym.classList = "noselect";
            gym.textContent = cacheDetails.gym;
        }

        let infoString = "";

        const age = cacheDetails.age;
        const height = cacheDetails.height;
        const weight = cacheDetails.weight;
        const medalscount = cacheDetails.medalscount;

        if (age) {
            if (age >= 15) {
                infoString += `<td class="cTd">${age} år</td>`;
            }
        }
        if (height) {
            if (height >= 140) {
                infoString += `<td class="cTd">${height} cm</td>`;
            }
        }
        if (weight) {
            if (weight >= 40) {
                infoString += `<td class="cTd">${weight} kg</td>`;
            }
        }
        if (medalscount) {
            if (medalscount > 0) {
                const medal = `<svg style="overflow: visible; opacity: 85%;" class="medals medalIconGold" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <defs>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                    <path class="medalIconGold"
                    d="M28.33,17.38v-14H11.67V17.38a1.66,1.66,0,0,0,.81,1.44l7,4.18L17.8,26.9l-5.68.48,4.31,3.74-1.31,5.55,4.88-3,4.88,3-1.3-5.55,4.32-3.74-5.68-.48L20.57,23l7-4.18A1.66,1.66,0,0,0,28.33,17.38Zm-6.66,3-1.67,1-1.67-1V5h3.34Z" />
                </g>
            </g>
            <text id="medalsCountTxt" class="medalsCount" x="12.5%" y="67.5%" text-anchor="end">${medalscount} x</text>
        </svg>`;
                const medalsInfo = document.getElementById("medalsInfo");
                medalsInfo.classList = "noselect";
                medalsInfo.innerHTML = medal;
            }
        }

        const infoList = document.getElementById("infoList");
        document.getElementById("info").classList = "noselect infoTable";

        if (infoString) {
            infoList.innerHTML = infoString;
        } else {
            infoList.textContent = "";
        }

        if (cacheDetails.hasOwnProperty("member_since")) {

            const splitDate = cacheDetails.member_since.split("-");

            const day = splitDate[2];
            const month = splitDate[1];
            const year = splitDate[0];
            let string = "";

            if (day && month && year) {
                if (day.length === 1 || day.length === 2 && month.length === 1 || month.length === 2 && year.length === 4) {

                    string = new Date(`${year}-${month}-${day}`);
                    if (isNaN(string)) {
                        string = `${day}.${month}.${year}`;
                    } else {
                        string = new Date(`${year}-${month}-${day}`).toLocaleDateString();
                    }
                }
            }

            document.getElementById("memberSince").classList = "";
            document.getElementById("memberSince").innerHTML = `Medlem siden<br>${string}`;
        }
    } catch {
        localStorage.removeItem("cacheDetails_owner");
    }
}

async function requestAccountDetails() {

    try {
        lifts = JSON.parse(localStorage.getItem("cachedLifts_owner"));
        goals = JSON.parse(localStorage.getItem("cachedGoals_owner"));
        badgeColorsJSON = JSON.parse(localStorage.getItem("cachedBadgeColors"));

        const cachedLiftsLeft = JSON.parse(localStorage.getItem("cachedLiftsLeft_owner"));
        const cachedGoalsLeft = JSON.parse(localStorage.getItem("cachedGoalsLeft_owner"));
        const cachedTrainingsplitsLeft = JSON.parse(localStorage.getItem("cachedTrainingsplitsLeft_owner"));

        activetrainingsplit = JSON.parse(localStorage.getItem("cachedActiveTrainingsplit_owner"));

        if (cachedLiftsLeft >= 0) {
            liftsLeft = new TliftsLeft(cachedLiftsLeft);
        }

        if (cachedGoalsLeft >= 0) {
            goalsLeft = new TgoalsLeft(cachedGoalsLeft);
        }

        if (cachedTrainingsplitsLeft >= 0) {
            trainingsplitsLeft = new TtrainingsplitsLeft(cachedTrainingsplitsLeft);
        }

        if (lifts) {
            showLiftBadgeAnimations = false;
            liftsInfo = new Tlifts(lifts);
            displayLifts();
        }

        if (goals) {
            showGoalBadgeAnimations = false;
            goalsInfo = new Tgoals(goals);
            displayGoals();
        }

        if (activetrainingsplit) {
            sessionStorage.removeItem("hasActiveTrainingsplit");
            showTrainingsplitBadgeAnimations = false;
        } else {
            sessionStorage.setItem("hasActiveTrainingsplit", false);
        }

        displayTrainingsplit();

        if (badgeColorsJSON) {
            badgeColors = new TbadgeColors(badgeColorsJSON);
        }



    } catch {
        localStorage.removeItem("cachedLifts_owner");
        localStorage.removeItem("cachedHasLiftsLeft_owner");
        localStorage.removeItem("cachedGoals_owner");
        localStorage.removeItem("cachedHasGoalsLeft_owner");
    }

    const resp = await getAccountDetails(userID);

    if (resp) {

        if (resp.hasOwnProperty("info")) {
            localStorage.setItem("cachedLifts_owner", JSON.stringify(resp.info.lifts));
            localStorage.setItem("cachedLiftsLeft_owner", resp.info.liftsLeft);
            localStorage.setItem("cachedGoals_owner", JSON.stringify(resp.info.goals));
            localStorage.setItem("cachedGoalsLeft_owner", resp.info.goalsLeft);
            localStorage.setItem("cachedBadgeColors", JSON.stringify(resp.info.badgeColors));
            localStorage.setItem("cachedTrainingsplitsLeft_owner", resp.info.trainingsplitsLeft);
            displayInformation(resp.info);
            return;
        }
    }

    //alert("Det har oppstått en feil!");
    //redirectToFeed();
}

// end of requestAccountDetails


// displayInformation

function displayInformation(respInfo) {

    if (!respInfo) {
        return;
    }

    const info = respInfo;
    size = 0;

    const displayname = info.displayname;
    const gym = info.info.gym;
    const age = info.info.age;
    const height = info.info.height;
    const weight = info.info.weight;
    const medalscount = info.info.medalscount;
    memberSince = info.member_since;

    let updateLifts = true, updateGoals = true, updateBadgeColors = true, updateActiveTrainingsplit = true;

    try {

        const checkExistingLifts = JSON.stringify(lifts);
        const checkUpdatedLifts = JSON.stringify(info.lifts);

        const checkExistingGoals = JSON.stringify(goals);
        const checkUpdatedGoals = JSON.stringify(info.goals);

        const checkExistingBadgeColors = JSON.stringify(badgeColorsJSON);
        const checkUpdatedBadgeColors = JSON.stringify(info.badgeColors);

        const checkExistingActiveTrainingsplit = JSON.stringify(activetrainingsplit);
        const checkUpdatedActiveTrainingsplit = JSON.stringify(info.activetrainingsplit);

        if (checkExistingLifts === checkUpdatedLifts) {
            updateLifts = false;
            console.log("skipped update lifts");
        }

        if (checkExistingGoals === checkUpdatedGoals) {
            updateGoals = false;
            console.log("skipped update goals");
        }

        if (checkExistingBadgeColors === checkUpdatedBadgeColors) {
            updateBadgeColors = false;
            console.log("skipped update badgeColors");
        }

        if (checkExistingActiveTrainingsplit === checkUpdatedActiveTrainingsplit) {
            updateActiveTrainingsplit = false;
            console.log("skipped update activeTrainingsplit");
        }

    } catch {

    }

    if (updateBadgeColors === true) {
        badgeColors = new TbadgeColors(info.badgeColors);
    }

    if (updateLifts === true) {
        lifts = info.lifts;
        showLiftBadgeAnimations = true;
    }

    if (updateGoals === true) {
        goals = info.goals;
        showGoalBadgeAnimations = true;
    }

    if (updateActiveTrainingsplit === true) {
        activetrainingsplit = info.activetrainingsplit;
        showTrainingsplitBadgeAnimations = true;
    }

    if (displayname) {
        document.getElementById("title").textContent = displayname;
    } else {
        document.getElementById("title").textContent = "";
    }

    if (gym) {
        document.getElementById("gym").textContent = gym;
    } else {
        document.getElementById("gym").textContent = "";
    }

    let infoString = "";

    if (age) {
        if (age >= 15) {
            infoString += `<td class="cTd">${age} år</td>`;
        }
    }
    if (height) {
        if (height >= 140) {
            infoString += `<td class="cTd">${height} cm</td>`;
        }
    }
    if (weight) {
        if (weight >= 40) {
            infoString += `<td class="cTd">${weight} kg</td>`;
        }
    }
    if (medalscount) {
        if (medalscount > 0) {
            const medal = `<svg style="overflow: visible; opacity: 85%;" class="medals medalIconGold" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
            <defs>
                </defs>
                <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                <path class="medalIconGold"
                d="M28.33,17.38v-14H11.67V17.38a1.66,1.66,0,0,0,.81,1.44l7,4.18L17.8,26.9l-5.68.48,4.31,3.74-1.31,5.55,4.88-3,4.88,3-1.3-5.55,4.32-3.74-5.68-.48L20.57,23l7-4.18A1.66,1.66,0,0,0,28.33,17.38Zm-6.66,3-1.67,1-1.67-1V5h3.34Z" />
            </g>
        </g>
        <text id="medalsCountTxt" class="medalsCount" x="12.5%" y="67.5%" text-anchor="end">${medalscount} x</text>
    </svg>`;
            document.getElementById("medalsInfo").innerHTML = medal;
        }
    }

    if (infoString) {
        document.getElementById("infoList").innerHTML = infoString;
    } else {
        document.getElementById("infoList").textContent = "";
    }

    if (lifts && updateLifts === true) {
        liftsLeft = new TliftsLeft(info.liftsLeft);
        liftsInfo = new Tlifts(info.lifts);
        displayLifts(info.liftsLeft > 0);
    }

    if (goals && updateGoals === true || lifts && updateLifts === true) {
        goalsLeft = new TgoalsLeft(info.goalsLeft);
        goalsInfo = new Tgoals(info.goals);
        displayGoals(info.goalsLeft > 0, true);
    }

    if (info.trainingsplitsLeft) {
        trainingsplitsLeft = new TtrainingsplitsLeft(info.trainingsplitsLeft);
    }

    if (updateActiveTrainingsplit === true) {
        document.getElementById("trainingsplit").innerHTML = "Treningsplan";
        displayTrainingsplit();
    }
}

// end of displayInformation


/// ------------ start of displayLifts --------------- ///

function displayLifts(hasLiftsLeft) {

    try {

        hasLiftsLeft = localStorage.getItem("cachedLiftsLeft_owner") > 0 || false;

        document.getElementById("badgesLiftsTableRow").innerHTML = "";

        let sortBy = localStorage.getItem("display_lifts_owner");

        let showLifts = lifts;

        if (sortBy) {
            if (allowedExercises.includes(sortBy)) {

                showLifts = lifts[sortBy];
                if (showLifts.length === 0) {
                    sortBy = null;
                    localStorage.removeItem("display_lifts_owner");
                }

            }
        }

        const keys = Object.keys(lifts);

        const arr = [];

        if (sortBy === null) {
            for (let i = 0; i < keys.length; i++) {
                const exerciseLift = lifts[keys[i]];
                displayPerExercise(exerciseLift, keys[i]);
            }
        } else {
            const exerciseLift = showLifts;
            displayPerExercise(exerciseLift, sortBy);
        }

        function displayPerExercise(aExerciseLift, aCurrent) {

            let msg = "";

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

        const selectHTML = `<select id="changeLiftFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalOwner('changeLiftFilter', 'lift');"></select>`;

        if (arr.length > 0) {

            document.getElementById("lifts").innerHTML = `Løft: ${selectHTML}`;

            document.getElementById("changeLiftFilter").innerHTML = `<option id="totalLifts" value="null"></option>`;

            let totalCount = 0;

            for (let x = 0; x < keys.length; x++) {

                if (lifts[keys[x]].length > 0) {

                    let html = `<option value="${keys[x]}">${capitalizeFirstLetter(keys[x])} (${lifts[keys[x]].length})</option>`;

                    if (keys[x] === sortBy) {
                        html = `<option selected="selected" value="${keys[x]}">${capitalizeFirstLetter(keys[x])} (${lifts[keys[x]].length})</option>`;
                    }

                    document.getElementById("changeLiftFilter").innerHTML += html;

                    const currentLiftKeys = lifts[keys[x]];
                    for (let z = 0; z < currentLiftKeys.length; z++) {
                        totalCount++;
                    }
                }

            }

            document.getElementById("totalLifts").innerHTML = `Alle (${totalCount})`;

            arr.sort(function (a, b) { return b.kg - a.kg });
            for (let i = 0; i < arr.length; i++) {
                //const badge = getBadgeLift(size, arr[i]);

                const badge = getBadgeLift(0, arr[i], arr[i].id);
                const badgesLiftsTableRow = document.getElementById("badgesLiftsTableRow");

                if (badge && badgesLiftsTableRow) {
                    badgesLiftsTableRow.innerHTML += badge;
                }
            }

        } else {
            document.getElementById("lifts").innerHTML = `Du har ingen løft enda!`;
        }

        if (hasLiftsLeft === true || Object.entries(lifts).length === 0) {

            const badge = getBadgeLift();
            const badgesLiftsTableRow = document.getElementById("badgesLiftsTableRow");

            if (badge && badgesLiftsTableRow) {
                badgesLiftsTableRow.innerHTML += badge;
            }
        }

        if (sessionStorage.getItem("badgeslifts_scroll_x")) {
            GbadgesLifts.scrollLeft = sessionStorage.getItem("badgeslifts_scroll_x");
        } else {
            GbadgesLifts.scrollLeft = 0;
        }

    } catch (err) {
        console.log(err);
    }
}

/// ------------ end of displayLifts --------------- ///


/// ------------ start of displayGoals --------------- ///

function displayGoals(hasGoalsLeft, checkIfCompleted) {

    try {

        const completedGoalsList = {};

        if (checkIfCompleted !== true) {
            checkIfCompleted = false;
        }

        hasGoalsLeft = localStorage.getItem("cachedGoalsLeft_owner") > 0 || false;

        document.getElementById("badgesGoalsTableRow").innerHTML = "";

        let sortBy = localStorage.getItem("display_goals_owner");

        let showGoals = goals;

        if (sortBy) {
            if (allowedExercises.includes(sortBy)) {

                showGoals = goals[sortBy];
                if (showGoals.length === 0) {
                    sortBy = null;
                    localStorage.removeItem("display_goals_owner");
                }
            }
        }

        const keys = Object.keys(goals);

        const arr = [];

        if (sortBy === null) {
            for (let i = 0; i < keys.length; i++) {
                const exerciseGoal = goals[keys[i]];
                displayPerExercise(exerciseGoal, keys[i]);
            }
        } else {
            const exerciseGoal = showGoals;
            displayPerExercise(exerciseGoal, sortBy);
        }

        function displayPerExercise(aExerciseGoal, aCurrent) {

            let kgUntilGoal = 0, repsUntilGoal = 0, msg = "", untilGoal = 0;

            const exerciseGoal = aExerciseGoal;
            const current = aCurrent;
            const exerciseGoalKeys = Object.keys(exerciseGoal);

            for (let j = 0; j < exerciseGoalKeys.length; j++) {

                const goalKeys = exerciseGoal[exerciseGoalKeys[j]];

                if (goalKeys) {

                    const id = goalKeys.id;
                    const color = goalKeys.color || "redBadgeG";
                    const goalReps = parseInt(goalKeys.reps);
                    const goalKg = parseFloat(goalKeys.kg);

                    const liftKeys = Object.keys(lifts[current]);

                    let highestLiftKg = { "kg": 0, "reps": 0 };

                    const liftsList = {};

                    if (goalKeys.completed !== true) {

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
                                    untilGoal = 0;
                                } else if (repsUntilGoal === 1) {
                                    msg = `1 rep igjen`;
                                    untilGoal = repsSM;
                                    calcPercent(highestLiftKg.reps, goalReps);
                                } else {
                                    msg = `${repsUntilGoal} reps igjen`;
                                    untilGoal = repsUntilGoal * repsSM;
                                    calcPercent(highestLiftKg.reps, goalReps);
                                }
                            } else {
                                kgUntilGoal = goalKg - highestLiftKg.kg;
                                if (kgUntilGoal <= 0) {
                                    msg = "Målet er nådd!";
                                    untilGoal = 0;
                                } else {
                                    msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                    untilGoal = kgUntilGoal;
                                    calcPercent(highestLiftKg.kg, goalKg);
                                }
                            }
                        }

                        if (highestLiftKg.kg >= goalKg) {
                            if (liftsList[goalKg]) {
                                repsUntilGoal = goalReps - liftsList[goalKg];
                                if (repsUntilGoal <= 0) {
                                    msg = "Målet er nådd!";
                                    untilGoal = 0;
                                } else if (repsUntilGoal === 1) {
                                    msg = `1 rep igjen`;
                                    untilGoal = repsSM;
                                    calcPercent(liftsList[goalKg], goalReps);
                                } else {
                                    msg = `${repsUntilGoal} reps igjen`;
                                    untilGoal = repsUntilGoal * repsSM;
                                    calcPercent(liftsList[goalKg], goalReps);
                                }
                            } else {
                                msg = `${goalReps} reps igjen`;
                                untilGoal = goalReps * repsSM;
                                calcPercent(liftsList[goalKg], goalReps);
                            }
                        } else {
                            kgUntilGoal = goalKg - highestLiftKg.kg;
                            msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                            untilGoal = kgUntilGoal;
                            calcPercent(highestLiftKg.kg, goalKg);
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

                        if (untilGoal === 0) {
                            progressionPercent = 100;
                            if (checkIfCompleted === true) {
                                if (goalKeys.completed !== true) {
                                    if (!completedGoalsList[current]) {
                                        completedGoalsList[current] = [];
                                    }
                                    completedGoalsList[current].push(id);
                                }
                            }
                        }

                        if (progressionPercent < 0) {
                            progressionPercent = 0;
                        }
                        if (progressionPercent > 100) {
                            progressionPercent = 100;
                        }
                    } else {
                        progressionPercent = 100;
                        msg = "Målet er nådd!";
                    }

                    arr.push({ "exercise": capitalizeFirstLetter(current), "kg": goalKg, "untilGoal": untilGoal, "msg": msg, "color": color, "id": id, "progressionPercent": progressionPercent });

                }
            }
        }

        const selectHTML = `<select id="changeGoalFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalOwner('changeGoalFilter', 'goal');"></select>`;

        if (arr.length > 0) {

            document.getElementById("goals").innerHTML = `Mål: ${selectHTML}`;

            document.getElementById("changeGoalFilter").innerHTML = `<option id="totalGoals" value="null"></option>`;

            let totalCount = 0;

            for (let x = 0; x < keys.length; x++) {

                if (goals[keys[x]].length > 0) {

                    let html = `<option value="${keys[x]}">${capitalizeFirstLetter(keys[x])} (${goals[keys[x]].length})</option>`;

                    if (keys[x] === sortBy) {
                        html = `<option selected="selected" value="${keys[x]}">${capitalizeFirstLetter(keys[x])} (${goals[keys[x]].length})</option>`;
                    }

                    document.getElementById("changeGoalFilter").innerHTML += html;

                    const currentGoalKeys = goals[keys[x]];
                    for (let z = 0; z < currentGoalKeys.length; z++) {
                        totalCount++;
                    }
                }
            }

            document.getElementById("totalGoals").innerHTML = `Alle (${totalCount})`;

            //arr.sort(function (a, b) { return a.untilGoal - b.untilGoal });
            arr.sort(function (a, b) { return b.progressionPercent - a.progressionPercent });

            for (let i = 0; i < arr.length; i++) {

                const badge = getBadgeGoals(size, arr[i], arr[i].id);

                const badgesGoalsTableRow = document.getElementById("badgesGoalsTableRow");

                if (badge && badgesGoalsTableRow) {
                    badgesGoalsTableRow.innerHTML += badge;
                }
            }

            if (navigator.onLine) {
                const completedGoalsListKeys = Object.keys(completedGoalsList);
                if (completedGoalsListKeys.length > 0) {
                    setGoalAsComplete();
                    async function setGoalAsComplete() {
                        const infoHeader = { "completedGoalsList": completedGoalsList };
                        const url = `/user/update/goals/completed`;
                        const resp = await callServerAPIPost(infoHeader, url);

                        if (resp.status === true) {
                            const medalsCountTxt = document.getElementById("medalsCountTxt");
                            if (medalsCountTxt) {
                                medalsCountTxt.innerHTML = `${resp.totalMedals} x`;
                            } else {
                                location.reload();
                            }
                        }
                    }
                }
            }

        } else {
            document.getElementById("goals").innerHTML = `Du har ingen mål enda!`;
        }

        if (hasGoalsLeft === true || Object.entries(goals).length === 0) {

            const badge = getBadgeGoals();

            const badgesGoalsTableRow = document.getElementById("badgesGoalsTableRow");

            if (badge && badgesGoalsTableRow) {
                badgesGoalsTableRow.innerHTML += badge;
            }
        }

        if (sessionStorage.getItem("badgesgoals_scroll_x")) {
            GbadgesGoals.scrollLeft = sessionStorage.getItem("badgesgoals_scroll_x");
        } else {
            GbadgesGoals.scrollLeft = 0;
        }

    } catch (err) {
        console.log(err);
    }
}

/// ------------ end of displayGoals --------------- ///



/// ------------ start of displayTrainingsplit --------------- ///

function displayTrainingsplit() {

    try {

        if (sessionStorage.getItem("hasActiveTrainingsplit") === "false" && !activetrainingsplit) {
            showTrainingsplitBadgeAnimations = false;
        }

        document.getElementById("badgesTrainingsplitTableRow").innerHTML = "";
        if (activetrainingsplit) {
            document.getElementById("trainingsplit").innerHTML = `Treningsplan (${activetrainingsplit.trainingsplit_name})`;

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

            const keys = Object.keys(activetrainingsplit);
            const arr = [];

            if (keys.length > 0) {
                for (let i = 0; i < keys.length; i++) {

                    if (days.includes(keys[i]) && daysNorwegian[keys[i]]) {
                        let activeTrainingsplitKeys = activetrainingsplit[keys[i]];
                        if (activeTrainingsplitKeys.short.length > 0) {
                            const color = "redBadgeG";
                            arr.push({ "day": daysNorwegian[keys[i]], "trainingsplit": activeTrainingsplitKeys.short, "color": color, "trainingsplit_id": activetrainingsplit.trainingsplit_id });
                        }
                    }
                }

                if (arr.length > 0) {
                    ;

                    for (let i = 0; i < arr.length; i++) {

                        //const badge = getBadgeTrainingsplit(size, arr[i]);
                        const badge = getBadgeTrainingsplit(0, arr[i]);

                        if (badge) {
                            document.getElementById("badgesTrainingsplitTableRow").innerHTML += badge;
                        }
                    }
                }
            }

            const badge = getBadgeTrainingsplit();

            if (badge) {
                document.getElementById("badgesTrainingsplitTableRow").innerHTML += badge;
            }

        } else {
            const badge = getBadgeTrainingsplit();

            if (badge) {
                document.getElementById("badgesTrainingsplitTableRow").innerHTML = badge;
            }
        }
    } catch (err) {
        console.log(err)
    }

    if (sessionStorage.getItem("badgestrainingsplit_scroll_x")) {
        GbadgesTrainingsplit.scrollLeft = sessionStorage.getItem("badgestrainingsplit_scroll_x");
    } else {
        GbadgesTrainingsplit.scrollLeft = 0;
    }

}

/// ------------ end of displayTrainingsplit --------------- ///

if (memberSince) {

    const splitDate = memberSince.split("-");

    const day = splitDate[2];
    const month = splitDate[1];
    const year = splitDate[0];
    let string = "";

    if (day && month && year) {
        if (day.length === 1 || day.length === 2 && month.length === 1 || month.length === 2 && year.length === 4) {

            string = new Date(`${year}-${month}-${day}`);
            if (isNaN(string)) {
                string = `${day}.${month}.${year}`;
            } else {
                string = new Date(`${year}-${month}-${day}`).toLocaleDateString();
            }
        }
    }

    document.getElementById("memberSince").innerHTML = `Medlem siden<br>${string}`;

}