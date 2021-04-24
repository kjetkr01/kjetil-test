// requestAccountDetails

async function requestAccountDetails() {
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
    userGrid.innerHTML = "";

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

        let sortBy = sessionStorage.getItem("display_lifts");

        let showLifts = lifts;

        if (sortBy) {
            if (allowedExercises.includes(sortBy)) {

                showLifts = lifts[sortBy];
                if (showLifts.length === 0) {
                    sortBy = null;
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

                        /*const prDateArr = liftKeys.date.split("-");
    
                        if (prDateArr.length === 3) {
    
                            if (prDateArr[0].length === 4 && prDateArr[1] > 0 && prDateArr[1] <= 12 && prDateArr[1].length <= 2 && prDateArr[2] > 0 && prDateArr[2] <= 31 && prDateArr[2].length <= 2) {
    
                                const d = new Date();
                                const prDate = new Date(prDateArr[0], (prDateArr[1] - 1), prDateArr[2]);
    
                                const daysSinceTime = parseInt((d - prDate) / (1000 * 3600 * 24));
    
                                if (d < prDate) {
                                    //fremtiden
                                } else if (daysSinceTime > 1) {
                                    msg = `${parseInt(daysSinceTime)} dager siden`;
                                } else if (daysSinceTime === 1) {
                                    msg = `I går`;
                                } else if (daysSinceTime === 0) {
                                    msg = `I dag`;
                                }
                            }
                        }*/

                        arr.push({ "exercise": capitalizeFirstLetter(current), "kg": liftKeys.kg, "msg": msg, "color": color, "id": id });

                    }
                }
            }
        }

        if (arr.length > 0) {

            userGrid.innerHTML += `
<div id="Glifts">
<p id="lifts" class="fadeIn animate delaySmall">
Løft (${arr.length}) <select id="changeFilter" onchange="sortByLifts('changeFilter');"></select>
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

            if (sortBy) {
                if (allowedExercises.includes(sortBy)) {
                    document.getElementById("lifts").innerHTML = `Løft: ${capitalizeFirstLetter(sortBy)} (${arr.length}) <select id="changeFilter" onchange="sortByLifts('changeFilter');"></select>`;
                }
            }

            document.getElementById("changeFilter").innerHTML = `<option value="null">Alle</option>`;

            for (let x = 0; x < keys.length; x++) {

                if (lifts[keys[x]].length > 0) {

                    let html = `<option value="${keys[x]}">${capitalizeFirstLetter(keys[x])}</option>`;

                    if (keys[x] === sortBy) {
                        html = `<option selected="selected" value="${keys[x]}">${capitalizeFirstLetter(keys[x])}</option>`;
                    }

                    document.getElementById("changeFilter").innerHTML += html;
                }
            }

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

            userGrid.innerHTML += `
<div id="Glifts">
<p id="lifts" class="fadeIn animate delaySmall">
Løft
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
                    const goalReps = goalKeys.reps;
                    const goalKg = parseFloat(goalKeys.kg);

                    let currentLiftPR = 0;

                    const liftKeys = Object.keys(lifts[keys[i]]);

                    for (let f = 0; f < liftKeys.length; f++) {
                        const lift = lifts[keys[i]][f];
                        if (lift.reps === "1" && goalReps === "1") {
                            currentLiftPR = parseFloat(lift.kg);
                            console.log(currentLiftPR)
                            console.log(goalKg)
                            console.log("1 rm");
                        } else if (lift.kg === goalKg) {
                            console.log("reps left");
                        }
                    }

                    kgUntilGoal = goalKg - currentLiftPR;

                    if (kgUntilGoal <= 0) {
                        msg = "Målet er nådd!";
                    } else {
                        msg = `${kgUntilGoal} kg igjen`;
                    }

                    arr.push({ "exercise": capitalizeFirstLetter(keys[i]), "kg": goalKg, "kgLeft": kgUntilGoal, "msg": msg, "color": color, "id": id });

                }
            }

        }

        if (arr.length > 0) {

            userGrid.innerHTML += `
<div id="Ggoals">
<p id="goals" class="fadeIn animate delaySmall">
Mål (${arr.length})
</p>
</div>

<div id="GlineGoals">
<hr id="lineGoals" class="fadeIn animate delayMedium">
</div>

<div id="GbadgesGoals">
<table id="badgesGoals">
<tr id="badgesGoalsTableRow">
</tr>
</table>
</div>
`;

            arr.sort(function (a, b) { return a.kgLeft - b.kgLeft });

            for (let i = 0; i < arr.length; i++) {

                const badge = getBadgeGoals(size, arr[i], arr[i].id);

                const badgesGoalsTableRow = document.getElementById("badgesGoalsTableRow");

                if (badge && badgesGoalsTableRow) {
                    badgesGoalsTableRow.innerHTML += badge;
                }
            }
        } else {
            userGrid.innerHTML += `
<div id="Ggoals">
<p id="goals" class="fadeIn animate delaySmall">
Mål
</p>
</div>

<div id="GlineGoals">
<hr id="lineGoals" class="fadeIn animate delayMedium">
</div>

<div id="GbadgesGoals">
<table id="badgesGoals">
<tr id="badgesGoalsTableRow">
</tr>
</table>
</div>
`;
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
                    string = `${day}.${month}..${year}`;
                } else {
                    string = new Date(`${year}-${month}-${day}`).toLocaleDateString();
                }
            }
        }

        userGrid.innerHTML += `
        <div id="GmemberSince">
        <p id="memberSince" class="fadeIn animate delaySmall">
        Medlem siden<br>${string}
        </p>
        </div>
        `;

    }

}

 // end of displayInformation