"use strict";

let lifts = null,
    goals = null,
    activetrainingsplit = null,
    badgeColorsJSON = null,
    memberSince = null;

// displays cached user details if exists. Prevents waiting for content to load
function displayUserDetailsCached() {

    try {

        const userDetails = user.getDetails();

        if (userDetails.hasOwnProperty("gym")) {
            const gym = document.getElementById("gym");
            gym.classList = "noselect";
            gym.textContent = userDetails.gym;
        }

        let infoString = "";

        const age = userDetails.age;
        const height = userDetails.height;
        const weight = userDetails.weight;
        const medalscount = userDetails.medalscount;

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

        const member_since = user.getDetail("member_since");

        if (member_since) {

            const splitDate = member_since.split("-");

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
    }
}
// End of displayUserDetailsCached function

// requests account details
async function requestAccountDetails() {

    if (user) {

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
                showTrainingsplitBadgeAnimations = false;
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

        const resp = await getAccountDetails(user.getId());

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
    }
}
// End of requestAccountDetails function


// displayInformation
function displayInformation(respInfo) {

    if (!respInfo) {
        return;
    }

    const info = respInfo;

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
        const checkUpdatedLiftsFilter = info.settings.lifts_filter_exercise;

        const checkExistingGoals = JSON.stringify(goals);
        const checkUpdatedGoals = JSON.stringify(info.goals);
        const checkUpdatedGoalsFilter = info.settings.goals_filter_exercise;

        const checkExistingBadgeColors = JSON.stringify(badgeColorsJSON);
        const checkUpdatedBadgeColors = JSON.stringify(info.badgeColors);

        const checkExistingActiveTrainingsplit = JSON.stringify(activetrainingsplit);
        const checkUpdatedActiveTrainingsplit = JSON.stringify(info.activetrainingsplit);

        if (checkExistingLifts === checkUpdatedLifts && checkUpdatedLiftsFilter === user.getSetting("lifts_filter_exercise")) {
            updateLifts = false;
        }

        if (checkExistingGoals === checkUpdatedGoals && weight === user.getDetail("weight") && checkUpdatedGoalsFilter === user.getSetting("goals_filter_exercise")) {
            updateGoals = false;
        }

        if (checkExistingBadgeColors === checkUpdatedBadgeColors) {
            updateBadgeColors = false;
        }

        if (checkExistingActiveTrainingsplit === checkUpdatedActiveTrainingsplit && info.settings.activetrainingsplit === user.getSetting("activetrainingsplit")) {
            updateActiveTrainingsplit = false;
        }

    } catch {

    }

    if (updateBadgeColors === true) {
        badgeColorsJSON = info.badgeColors;
        badgeColors = new TbadgeColors(info.badgeColors);
    }

    if (updateLifts === true) {
        lifts = info.lifts;
        if (user.getSetting("lifts_filter_exercise") !== info.settings.lifts_filter_exercise) {
            user.changeSetting("lifts_filter_exercise", info.settings.lifts_filter_exercise);
        }
        showLiftBadgeAnimations = true;
    }

    if (updateGoals === true) {
        if (user.getDetail("weight") !== weight) {
            user.changeDetail("weight", weight);
        }
        if (user.getSetting("goals_filter_exercise") !== info.settings.goals_filter_exercise) {
            user.changeSetting("goals_filter_exercise", info.settings.goals_filter_exercise);
        }
        goals = info.goals;
        showGoalBadgeAnimations = true;
    }

    if (updateActiveTrainingsplit === true) {
        activetrainingsplit = info.activetrainingsplit;
        showTrainingsplitBadgeAnimations = true;
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
// End of displayInformation function


// displays lifts if user has any
async function displayLifts(hasLiftsLeft) {

    try {

        document.getElementById("badgesLiftsTableRow").innerHTML = "";

        hasLiftsLeft = localStorage.getItem("cachedLiftsLeft_owner") > 0 || false;

        let sortByLifts = user.getSetting("lifts_filter_exercise");

        let showLifts = lifts;

        if (sortByLifts) {
            if (lifts[sortByLifts]) {
                showLifts = lifts[sortByLifts];
                if (showLifts.length === 0) {
                    sortByLifts = null;
                    user.changeSetting("lifts_filter_exercise", null);

                    if (navigator.onLine) {
                        const value = null;
                        const setting = "lifts_filter_exercise";

                        const infoHeader = { "updateSetting": setting, "value": value };
                        const url = `/user/update/settings/${setting}`;

                        await callServerAPIPost(infoHeader, url);
                    }
                }
            } else {
                sortByLifts = null;
                user.changeSetting("lifts_filter_exercise", null);
            }
        }

        const keys = Object.keys(lifts);

        const arr = [];

        if (sortByLifts === null) {
            for (let i = 0; i < keys.length; i++) {
                const exerciseLift = lifts[keys[i]];
                pushToArrPerExerciseLift(exerciseLift, keys[i], arr);
            }
        } else {
            const exerciseLift = showLifts;
            pushToArrPerExerciseLift(exerciseLift, sortByLifts, arr);
        }

        const selectHTML = `<select id="changeLiftFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalOwner('changeLiftFilter', 'lift');"></select>`;

        if (arr.length > 0) {

            document.getElementById("lifts").innerHTML = `Løft: ${selectHTML}`;

            document.getElementById("changeLiftFilter").innerHTML = `<option id="totalLifts" value="null"></option>`;

            let totalCount = 0;

            for (let x = 0; x < keys.length; x++) {

                if (lifts[keys[x]].length > 0) {

                    let html = `<option value="${keys[x]}">${capitalizeFirstLetter(keys[x])} (${lifts[keys[x]].length})</option>`;

                    if (keys[x] === sortByLifts) {
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

                const badge = getBadgeLift(arr[i], arr[i].id);
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
// End of displayLifts function


// displays goals if user has any
async function displayGoals(hasGoalsLeft, checkIfCompleted) {

    try {

        document.getElementById("badgesGoalsTableRow").innerHTML = "";

        const completedGoalsList = {};

        if (checkIfCompleted !== true) {
            checkIfCompleted = false;
        }

        hasGoalsLeft = localStorage.getItem("cachedGoalsLeft_owner") > 0 || false;

        let sortByGoals = user.getSetting("goals_filter_exercise");

        let showGoals = goals;

        if (sortByGoals) {
            if (goals[sortByGoals]) {
                showGoals = goals[sortByGoals];
                if (showGoals.length === 0) {
                    sortByGoals = null;
                    user.changeSetting("goals_filter_exercise", null);

                    if (navigator.onLine) {
                        const value = null;
                        const setting = "goals_filter_exercise";

                        const infoHeader = { "updateSetting": setting, "value": value };
                        const url = `/user/update/settings/${setting}`;

                        await callServerAPIPost(infoHeader, url);
                    }
                }
            } else {
                sortByGoals = null;
                user.changeSetting("goals_filter_exercise", null);
            }
        }

        const keys = Object.keys(goals);

        const arr = [];

        if (sortByGoals === null) {
            for (let i = 0; i < keys.length; i++) {
                const exerciseGoal = goals[keys[i]];
                pushToArrPerExerciseGoal(exerciseGoal, keys[i], checkIfCompleted, completedGoalsList, arr);
            }
        } else {
            const exerciseGoal = showGoals;
            pushToArrPerExerciseGoal(exerciseGoal, sortByGoals, checkIfCompleted, completedGoalsList, arr);
        }

        const selectHTML = `<select id="changeGoalFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalOwner('changeGoalFilter', 'goal');"></select>`;

        if (arr.length > 0) {

            document.getElementById("goals").innerHTML = `Mål: ${selectHTML}`;

            document.getElementById("changeGoalFilter").innerHTML = `<option id="totalGoals" value="null"></option>`;

            let totalCount = 0;

            for (let x = 0; x < keys.length; x++) {

                if (goals[keys[x]].length > 0) {

                    let html = `<option value="${keys[x]}">${capitalizeFirstLetter(keys[x])} (${goals[keys[x]].length})</option>`;

                    if (keys[x] === sortByGoals) {
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

            arr.sort(function (a, b) { return b.progressionPercent - a.progressionPercent });

            for (let i = 0; i < arr.length; i++) {

                const badge = getBadgeGoals(0, arr[i], arr[i].id);

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
// End of displayGoals function



// displays active trainingsplit if user has any
function displayTrainingsplit() {

    try {

        if (user.getSetting("activetrainingsplit") === null && !activetrainingsplit) {
            showTrainingsplitBadgeAnimations = false;
        }

        document.getElementById("badgesTrainingsplitTableRow").innerHTML = "";
        if (activetrainingsplit) {
            document.getElementById("trainingsplit").innerHTML = `Treningsplan (${activetrainingsplit.trainingsplit_name})`;



            const keys = Object.keys(activetrainingsplit);
            const arr = [];

            if (keys.length > 0) {

                pushToArrActiveTrainingsplit(activetrainingsplit, keys, arr);

                if (arr.length > 0) {

                    for (let i = 0; i < arr.length; i++) {

                        const badge = getBadgeTrainingsplit(arr[i]);

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
// End of displayTrainingsplit function


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

// Clears all saved scroll. Function gets called when "leaving" page
function clearAllSavedScolls() {

    const scrolls = ["usergrid_scroll_y_main", "badgeslifts_scroll_x", "badgesgoals_scroll_x", "badgestrainingsplit_scroll_x"];

    for (let i = 0; i < scrolls.length; i++) {
        sessionStorage.removeItem(scrolls[i]);
    }
}
// End of clearAllSavedScolls function