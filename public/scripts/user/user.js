let lifts = null, goals = null, memberSince = null, size = 0;

// requestAccountDetails

async function requestAccountDetails() {

    const viewingUser = sessionStorage.getItem("ViewingUser");

    /*try {
        const cachedDetails = JSON.parse(sessionStorage.getItem(`cachedDetails_visitor_${viewingUser}`));
        if (cachedDetails.hasOwnProperty("displayname")) {
            const title = document.getElementById("title");
            title.classList = "noselect";
            title.textContent = cachedDetails.displayname;
        }
        if (cachedDetails.hasOwnProperty("gym")) {
            const gym = document.getElementById("gym");
            gym.classList = "noselect";
            gym.textContent = cachedDetails.gym;
        }

        let infoString = "";

        const age = cachedDetails.age;
        const height = cachedDetails.height;
        const weight = cachedDetails.weight;
        memberSince = cachedDetails.member_since;

        if (age) {
            if (age >= 15) {
                infoString += `<td>${age} år</td>`;
            }
        }
        if (height) {
            if (height >= 140) {
                infoString += `<td>${height} cm</td>`;
            }
        }
        if (weight) {
            if (weight >= 40) {
                infoString += `<td>${weight} kg</td>`;
            }
        }

        const infoList = document.getElementById("infoList");
        document.getElementById("info").classList = "noselect infoTable";

        if (infoString) {
            infoList.innerHTML = infoString;
        } else {
            infoList.textContent = "";
        }

        if (memberSince) {
            document.getElementById("memberSince").classList = "";
            displayMemberSince();
        }

    } catch {
        sessionStorage.removeItem(`cachedDetails_visitor_${viewingUser}`);
    }*/

    if (viewingUser) {

        if (userID === parseInt(viewingUser)) {
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
                    alert(resp);
                    returnToPrevious();
                } else {
                    alert("Det har oppstått en feil!");
                    redirectToFeed();
                }

            } else {
                alert("Det har oppstått en feil!");
                redirectToFeed();
            }
        }

    } else {
        alert("Det har oppstått en feil!");
        redirectToFeed();
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
    const weight = info.info.weight;
    memberSince = info.member_since;

    traningsplitInfo = new Ttrainingsplit(info.trainingsplit);

    badgeColors = new TbadgeColors(info.badgeColors);

    lifts = info.lifts;
    goals = info.goals;
    const program = info.trainingsplit;

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
            infoString += `<td>${age} år</td>`;
        }
    }
    if (height) {
        if (height >= 140) {
            infoString += `<td>${height} cm</td>`;
        }
    }
    if (weight) {
        if (weight >= 40) {
            infoString += `<td>${weight} kg</td>`;
        }
    }

    if (infoString) {
        document.getElementById("infoList").innerHTML = infoString;
    } else {
        document.getElementById("infoList").textContent = "";
    }

    if (!Object.entries(lifts).length > 0 && !Object.entries(goals).length > 0 && !Object.entries(program).length > 0) {

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

        if (program) {
            //displayTrainingsplit();
        }

        if (memberSince) {
            displayMemberSince();
        }

    }

}

// end of displayInformation


/// ------------ start of displayLifts --------------- ///

function displayLifts() {

    let sortBy = sessionStorage.getItem("display_lifts_visitor");

    document.getElementById("badgesLiftsTableRow").innerHTML = "";

    let showLifts = lifts;

    if (sortBy) {
        if (allowedExercises.includes(sortBy)) {

            showLifts = lifts[sortBy];
            if (showLifts.length === 0) {
                sortBy = null;
                sessionStorage.removeItem("display_lifts_visitor");
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
                if (liftKeys.kg !== "0" && liftKeys.kg !== 0 && liftKeys.kg !== "") {

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

        if (sortBy) {
            if (allowedExercises.includes(sortBy)) {
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

            const badge = getBadgeLift(0, arr[i], arr[i].id);
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

    let sortBy = sessionStorage.getItem("display_goals_visitor");

    let showGoals = goals;

    if (sortBy) {
        if (allowedExercises.includes(sortBy)) {

            showGoals = goals[sortBy];
            if (showGoals.length === 0) {
                sortBy = null;
                sessionStorage.removeItem("display_goals_visitor");
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

        let kgUntilGoal = 0, repsUntilGoal = 0, msg = "";

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

                let currentLiftPR = 0;

                const liftKeys = Object.keys(lifts[current]);

                for (let f = 0; f < liftKeys.length; f++) {
                    const lift = lifts[current][f];
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


                arr.push({ "exercise": capitalizeFirstLetter(current), "kg": goalKg, "kgLeft": kgUntilGoal, "msg": msg, "color": color, "id": id });

            }
        }
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

        if (sortBy) {
            if (allowedExercises.includes(sortBy)) {
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

        arr.sort(function (a, b) { return a.kgLeft - b.kgLeft });

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

    userGrid.innerHTML += `
<div id="Gtrainingsplit">
<p id="trainingsplit" class="fadeIn animate delaySmall">
Treningsplan
</p>
</div>

<div id="GlineTrainingsplit">
<hr id="lineTrainingsplit" class="fadeIn animate delaySmall">
</div>

<div id="GbadgesTrainingsplit">
<table id="badgesTrainingsplit">
<tr id="badgesTrainingsplitTableRow">
</tr>
</table>
</div>
`;

    if (Object.entries(program).length > 0) {

        const keys = Object.keys(program);
        const arr = [];

        if (keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {

                let programKeys = program[keys[i]];
                const color = programKeys.color || "redBadgeG";

                /*
                if (programKeys === "0" || programKeys === 0 || programKeys === "") {
                    programKeys = "Fri";
                }
*/

                arr.push({ "day": keys[i], "trainingsplit": programKeys, "color": color });

            }

            if (arr.length > 0) {

                arr.sort(function (a, b) { return a.kgLeft - b.kgLeft });

                for (let i = 0; i < arr.length; i++) {

                    const badge = getBadgeTrainingsplit(size, arr[i]);

                    if (badge) {
                        document.getElementById("badgesTrainingsplitTableRow").innerHTML += badge;
                    }
                }
            }
        }
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