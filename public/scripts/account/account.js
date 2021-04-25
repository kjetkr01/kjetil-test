// requestAccountDetails

async function requestAccountDetails() {

    try {
        const cacheDetails = JSON.parse(sessionStorage.getItem("cacheDetails_owner"));
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
        sessionStorage.removeItem("cacheDetails_owner");
    }

    const resp = await getAccountDetails(userID);

    if (resp) {
        if (resp.hasOwnProperty("info")) {
            displayInformation(resp.info);
            return;
        }
    }

    alert("Det har oppstått en feil!");
    redirectToFeed();
}

// end of requestAccountDetails


// displayInformation

function displayInformation(respInfo) {

    if (!respInfo) {
        return;
    }

    const userGrid = document.getElementById("userGrid");

    const info = respInfo;
    const size = 0;

    const displayname = info.displayname;
    const gym = info.info.gym;
    const age = info.info.age;
    const height = info.info.height;
    const weight = info.info.weight;
    const memberSince = info.member_since;

    liftsLeft = new TliftsLeft(info.liftsLeft);
    goalsLeft = new TgoalsLeft(info.goalsLeft);

    traningsplitInfo = new Ttrainingsplit(info.trainingsplit);

    badgeColors = new TbadgeColors(info.badgeColors);

    const lifts = info.lifts;
    const goals = info.goals;
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
    if (lifts) {
        liftsInfo = new Tlifts(info.lifts);
        displayLifts(info.liftsLeft > 0);
    }

    if (goals) {
        goalsInfo = new Tgoals(info.goals);
        displayGoals(info.goalsLeft > 0);
    }

    if (program) {
        //displayTrainingsplit();
    }


    /// ------------ start of displayLifts --------------- ///

    function displayLifts(hasLiftsLeft) {

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

        const selectHTML = `<select id="changeLiftFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalOwner('changeLiftFilter', 'lift');"></select>`;

        if (arr.length > 0) {

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
                //const badge = getBadgeLift(size, arr[i]);

                const badge = getBadgeLift(0, arr[i], arr[i].id);
                const badgesLiftsTableRow = document.getElementById("badgesLiftsTableRow");

                if (badge && badgesLiftsTableRow) {
                    badgesLiftsTableRow.innerHTML += badge;
                }
            }

        }

        if (hasLiftsLeft === true || Object.entries(lifts).length === 0) {

            const badge = getBadgeLift();
            const badgesLiftsTableRow = document.getElementById("badgesLiftsTableRow");

            if (badge && badgesLiftsTableRow) {
                badgesLiftsTableRow.innerHTML += badge;
            }
        }

    }

    /// ------------ end of displayLifts --------------- ///


    /// ------------ start of displayGoals --------------- ///

    function displayGoals(hasGoalsLeft) {

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

        const selectHTML = `<select id="changeGoalFilter" class="changeFilterSelect pointer" onchange="sortByLiftsOrGoalOwner('changeGoalFilter', 'goal');"></select>`;

        if (arr.length > 0) {

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

        if (hasGoalsLeft === true || Object.entries(goals).length === 0) {

            const badge = getBadgeGoals();

            const badgesGoalsTableRow = document.getElementById("badgesGoalsTableRow");

            if (badge && badgesGoalsTableRow) {
                badgesGoalsTableRow.innerHTML += badge;
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

                        //const badge = getBadgeTrainingsplit(size, arr[i]);
                        const badge = getBadgeTrainingsplit(0, arr[i]);

                        if (badge) {
                            document.getElementById("badgesTrainingsplitTableRow").innerHTML += badge;
                        }
                    }
                }
            }
        }

        const badge = getBadgeTrainingsplit();

        if (badge) {
            document.getElementById("badgesTrainingsplitTableRow").innerHTML += badge;
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

}

 // end of displayInformation