"use strict";
let lifts = null,
    goals = null,
    weight = 0,
    activetrainingsplit = null,
    memberSince = null,
    size = 0,
    badgeColorsJSON = null;

const queryString = window.location.search,
    urlParams = new URLSearchParams(queryString);

function displayUserDetailsCached() {

    try {

        const ViewingUser = urlParams.get("user_id");

        if (ViewingUser) {

            const cacheDetails = JSON.parse(sessionStorage.getItem(`cachedDetails_visitor_${ViewingUser}`));

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
            weight = cacheDetails.weight;
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
                        <g id="Layer_2" data-name="Layer 2">
                        <g id="Layer_1-2" data-name="Layer 1">
                        <path class="medalIconGold"
                        d="M28.33,17.38v-14H11.67V17.38a1.66,1.66,0,0,0,.81,1.44l7,4.18L17.8,26.9l-5.68.48,4.31,3.74-1.31,5.55,4.88-3,4.88,3-1.3-5.55,4.32-3.74-5.68-.48L20.57,23l7-4.18A1.66,1.66,0,0,0,28.33,17.38Zm-6.66,3-1.67,1-1.67-1V5h3.34Z" />
                    </g>
                </g>
                <text class="medalsCount" x="12.5%" y="67.5%" text-anchor="end">${medalscount} x</text>
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
        }

    } catch {
        localStorage.removeItem("cacheDetails_owner");
    }
}


// requestAccountDetails

async function requestAccountDetails() {

    const viewingUser = urlParams.get("user_id");

    try {
        badgeColorsJSON = JSON.parse(localStorage.getItem("cachedBadgeColors"));
    } catch {

    }

    if (viewingUser) {

        if (user && user.getId() === parseInt(viewingUser)) {
            redirectToAccount();
        } else {

            const resp = await getAccountDetails(viewingUser);

            if (resp) {
                if (resp.hasOwnProperty("info")) {
                    if (resp.cacheDetails) {
                        //sessionStorage.setItem(`cachedDetails_visitor_${viewingUser}`, JSON.stringify(resp.cacheDetails));
                    }
                    displayInformation(resp.info);
                    return;
                } else if (resp.includes("sin profil er privat!") === true) {
                    //alert(resp);
                    //returnToPrevious();
                    const doms = ["title", "info", "gym", "medalsInfo", "memberSince"];
                    for (let i = 0; i < doms.length; i++) {
                        const dom = document.getElementById(doms[i]);
                        if (dom) {
                            dom.innerHTML = "";
                        }
                    }
                    showAlert(resp, true, "returnToPrevious();");
                } else {
                    /*alert("Det har oppstått en feil!");
                    redirectToFeed();*/
                    showAlert("Det har oppstått en feil!", true, "redirectToFeed();");
                }

            } else {
                /*alert("Det har oppstått en feil!");
                redirectToFeed();*/
                showAlert("Det har oppstått en feil!", true, "redirectToFeed();");
            }
        }

    } else {
        /*alert("Det har oppstått en feil!");
        redirectToFeed();*/
        showAlert("Det har oppstått en feil!", true, "redirectToFeed();");
    }
}

// end of requestAccountDetails


// displayInformation

function displayInformation(respInfo) {

    if (!respInfo) {
        return;
    }

    const userGrid = document.getElementById("userGrid");

    const info = respInfo;

    document.title = `${info.username} sin profil`;

    const displayname = info.displayname;
    const firstName = displayname.split(" ");
    const gym = info.info.gym;
    const age = info.info.age;
    const height = info.info.height;
    weight = info.info.weight;
    const medalscount = info.info.medalscount;
    memberSince = info.member_since;

    badgeColorsJSON = new TbadgeColors(info.badgeColors);

    lifts = info.lifts;
    goals = info.goals;
    activetrainingsplit = info.activetrainingsplit;

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
                <g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                <path class="medalIconGold"
                d="M28.33,17.38v-14H11.67V17.38a1.66,1.66,0,0,0,.81,1.44l7,4.18L17.8,26.9l-5.68.48,4.31,3.74-1.31,5.55,4.88-3,4.88,3-1.3-5.55,4.32-3.74-5.68-.48L20.57,23l7-4.18A1.66,1.66,0,0,0,28.33,17.38Zm-6.66,3-1.67,1-1.67-1V5h3.34Z" />
            </g>
        </g>
        <text class="medalsCount" x="12.5%" y="67.5%" text-anchor="end">${medalscount} x</text>
    </svg>`;
            document.getElementById("medalsInfo").innerHTML = medal;
        }
    }

    if (infoString) {
        document.getElementById("infoList").innerHTML = infoString;
    } else {
        document.getElementById("infoList").textContent = "";
    }

    if (!Object.entries(lifts).length > 0 && !Object.entries(goals).length > 0 && !Object.entries(activetrainingsplit).length > 0) {

        userGrid.innerHTML = `
<div id="Glifts">
<p id="lifts" class="fadeIn animate delaySmall">
${firstName[0]} har ingen løft, mål eller treningsplan
</p>
</div>

<div id="GlineLifts">
<hr id="lineLifts" class="fadeIn animate delayMedium">
</div>

<div id="GbadgesLifts">
<table id="badgesLifts">
<tr id="badgesLiftsTableRow">
</tr>
</table>
</div>
`;

    } else {

        if (lifts) {
            liftsInfo = new Tlifts(info.lifts);
            displayLifts();
        }

        if (goals) {
            goalsInfo = new Tgoals(info.goals);
            displayGoals();
        }

        if (activetrainingsplit) {
            displayTrainingsplit();
        }

        if (memberSince) {
            displayMemberSince();
        }
    }
}

// end of displayInformation


/// ------------ start of displayLifts --------------- ///

function displayLifts() {

    document.getElementById("badgesLiftsTableRow").innerHTML = "";
    let sortBy = sessionStorage.getItem("lifts_filter_exercise_visitor");

    let showLifts = lifts;

    if (sortBy) {
        if (lifts[sortBy]) {
            showLifts = lifts[sortBy];
            if (showLifts.length === 0) {
                sortBy = null;
                sessionStorage.removeItem("lifts_filter_exercise_visitor");
            }
        } else {
            sortBy = null;
            sessionStorage.removeItem("lifts_filter_exercise_visitor");
        }
    }

    const keys = Object.keys(lifts);

    const arr = [];

    if (sortBy === null) {
        for (let i = 0; i < keys.length; i++) {
            const exerciseLift = lifts[keys[i]];
            pushToArrPerExerciseLift(exerciseLift, keys[i], arr);
        }

    } else {
        const exerciseLift = showLifts;
        pushToArrPerExerciseLift(exerciseLift, sortBy, arr);
    }

    const selectHTML = `<select id="changeLiftFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalVisitor('changeLiftFilter', 'lift');"></select>`;

    if (arr.length > 0) {

        const showDomArr = ["Glifts", "GlineLifts", "GbadgesLifts"];
        for (let i = 0; i < showDomArr.length; i++) {
            const dom = document.getElementById(showDomArr[i]);
            if (dom) {
                dom.removeAttribute("class");
            }
        }

        if (sortBy && allowedLifts) {
            if (allowedLifts.includes(sortBy)) {
                document.getElementById("lifts").innerHTML = `Løft: ${selectHTML}`;
            }
        }

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

            const badge = getBadgeLift(arr[i], arr[i].id);
            const badgesLiftsTableRow = document.getElementById("badgesLiftsTableRow");

            if (badge && badgesLiftsTableRow) {
                badgesLiftsTableRow.innerHTML += badge;
            }
        }
    }
}

/// ------------ end of displayLifts --------------- ///




/// ------------ start of displayGoals --------------- ///

function displayGoals() {

    document.getElementById("badgesGoalsTableRow").innerHTML = "";
    let sortBy = sessionStorage.getItem("goals_filter_exercise_visitor");

    let showGoals = goals;

    if (sortBy) {
        if (goals[sortBy]) {
            showGoals = goals[sortBy];
            if (showGoals.length === 0) {
                sortBy = null;
                sessionStorage.removeItem("goals_filter_exercise_visitor");
            }
        } else {
            sortBy = null;
            sessionStorage.removeItem("goals_filter_exercise_visitor");
        }
    }

    const keys = Object.keys(goals);

    const arr = [];

    if (sortBy === null) {
        for (let i = 0; i < keys.length; i++) {
            const exerciseGoal = goals[keys[i]];
            pushToArrPerExerciseGoal(exerciseGoal, keys[i], null, null, arr);
        }
    } else {
        const exerciseGoal = showGoals;
        pushToArrPerExerciseGoal(exerciseGoal, sortBy, null, null, arr);
    }

    const selectHTML = `<select id="changeGoalFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalVisitor('changeGoalFilter', 'goal');"></select>`;

    if (arr.length > 0) {

        const showDomArr = ["Ggoals", "GlineGoals", "GbadgesGoals"];
        for (let i = 0; i < showDomArr.length; i++) {
            const dom = document.getElementById(showDomArr[i]);
            if (dom) {
                dom.removeAttribute("class");
            }
        }

        if (sortBy && allowedGoals) {
            if (allowedGoals.includes(sortBy)) {
                document.getElementById("goals").innerHTML = `Mål: ${selectHTML}`;
            }
        }

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

        arr.sort(function (a, b) { return b.progressionPercent - a.progressionPercent });

        for (let i = 0; i < arr.length; i++) {

            const badge = getBadgeGoals(size, arr[i], arr[i].id);

            const badgesGoalsTableRow = document.getElementById("badgesGoalsTableRow");

            if (badge && badgesGoalsTableRow) {
                badgesGoalsTableRow.innerHTML += badge;
            }
        }
    }
}

/// ------------ end of displayGoals --------------- ///



/// ------------ start of displayTrainingsplit --------------- ///

function displayTrainingsplit() {

    try {
        document.getElementById("badgesTrainingsplitTableRow").innerHTML = "";
        if (activetrainingsplit) {
            document.getElementById("trainingsplit").innerHTML = `Treningsplan (${activetrainingsplit.trainingsplit_name})`;

            const keys = Object.keys(activetrainingsplit);
            const arr = [];

            if (keys.length > 0) {

                pushToArrActiveTrainingsplit(activetrainingsplit, keys, arr);

                if (arr.length > 0) {

                    const showDomArr = ["Gtrainingsplit", "GlineTrainingsplit", "GbadgesTrainingsplit"];
                    for (let i = 0; i < showDomArr.length; i++) {
                        const dom = document.getElementById(showDomArr[i]);
                        if (dom) {
                            dom.removeAttribute("class");
                        }
                    }

                    for (let i = 0; i < arr.length; i++) {

                        const badge = getBadgeTrainingsplit(arr[i]);

                        if (badge) {
                            document.getElementById("badgesTrainingsplitTableRow").innerHTML += badge;
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
}

/// ------------ end of displayTrainingsplit --------------- ///

function displayMemberSince() {

    const memberSinceDOM = document.getElementById("memberSince");

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

    memberSinceDOM.innerHTML = `Medlem siden<br>${string}`;

}