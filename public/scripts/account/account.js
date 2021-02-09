// requestAccountDetails

async function requestAccountDetails() {
    const resp = await getAccountDetails(username);

    if (resp) {
        if (resp.hasOwnProperty("info")) {
            displayInformation(resp.info);
            return;
        }
    }

    //alert("Det har oppstått en feil!");
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

    liftsLeft = new TliftsLeft(info.liftsLeft);
    goalsLeft = new TgoalsLeft(info.goalsLeft);

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
        displayLifts(info.liftsLeft.length > 0);
    }

    if (goals) {
        goalsInfo = new Tgoals(info.goals);
        displayGoals(info.goalsLeft.length > 0);
    }

    if (program) {
        displayTrainingsplit();
    }


    /// ------------ start of displayLifts --------------- ///

    function displayLifts(hasLiftsLeft) {

        if (Object.entries(lifts).length > 0) {

            const keys = Object.keys(lifts);

            if (keys.length > 0) {

                const arr = [];
                let msg = "";

                for (let i = 0; i < keys.length; i++) {

                    const liftKeys = lifts[keys[i]];

                    if (liftKeys.ORM !== "0" && liftKeys.ORM !== 0 && liftKeys.ORM !== "") {

                        const color = liftKeys.color || "redBadgeG";

                        const prDateArr = liftKeys.PRdate.split("-");

                        if (prDateArr.length === 3) {

                            if (prDateArr[0].length === 4 && prDateArr[1] > 0 && prDateArr[1] <= 12 && prDateArr[1].length <= 2 && prDateArr[2] > 0 && prDateArr[2] <= 31 && prDateArr[2].length <= 2) {

                                const d = new Date();
                                const prDate = new Date(prDateArr[0], (prDateArr[1] - 1), prDateArr[2]);

                                const daysSinceTime = parseInt((d - prDate) / (1000 * 3600 * 24));

                                if (daysSinceTime > 1) {
                                    msg = `${parseInt(daysSinceTime)} dager siden`;
                                } else if (daysSinceTime === 1) {
                                    msg = `1 dag siden`;
                                }
                                else if (daysSinceTime === 0) {
                                    msg = `I dag`;
                                }
                            }
                        }

                        arr.push({ "exercise": keys[i], "kg": liftKeys.ORM, "msg": msg, "color": color });

                    }
                }

                if (arr.length > 0) {

                    userGrid.innerHTML += `
<div id="Glifts">
<p id="lifts" class="fadeIn animate delaySmall">
Løft (${arr.length})
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

                    arr.sort(function (a, b) { return b.kg - a.kg });
                    for (let i = 0; i < arr.length; i++) {
                        const badge = getBadgeLift(size, arr[i]);

                        if (badge) {
                            document.getElementById("badgesLiftsTableRow").innerHTML += badge;
                        }
                    }
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

            if (badge) {
                document.getElementById("badgesLiftsTableRow").innerHTML += badge;
            }
        }

    }

    /// ------------ end of displayLifts --------------- ///




    /// ------------ start of displayGoals --------------- ///

    function displayGoals(hasGoalsLeft) {

        if (Object.entries(goals).length > 0) {

            const goalKeys = Object.keys(goals);

            const arr = [];
            let kgUntilGoal = 0, msg = "";

            for (let i = 0; i < Object.entries(goals).length; i++) {

                if (goalKeys[i]) {

                    if (goals[goalKeys[i]].goal > 0) {

                        const color = goals[goalKeys[i]].color || "redBadgeG";

                        const currentGoalPR = parseFloat(goals[goalKeys[i]].goal);
                        let currentLiftPR = 0;

                        if (lifts[goalKeys[i]]) {
                            currentLiftPR = parseFloat(lifts[goalKeys[i]].ORM);
                        }

                        kgUntilGoal = currentGoalPR - currentLiftPR;

                        if (kgUntilGoal <= 0) {
                            msg = "Målet er nådd!";
                        } else {
                            msg = `${kgUntilGoal} kg igjen`;
                        }

                        arr.push({ "exercise": goalKeys[i], "kg": currentGoalPR, "kgLeft": kgUntilGoal, "msg": msg, "color": color });
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

                    const badge = getBadgeGoals(size, arr[i]);

                    if (badge) {
                        document.getElementById("badgesGoalsTableRow").innerHTML += badge;
                    }
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

            if (badge) {
                document.getElementById("badgesGoalsTableRow").innerHTML += badge;
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

                    if (programKeys !== "0" && programKeys !== 0 && programKeys !== "") {

                        arr.push({ "day": keys[i], "trainingsplit": programKeys, "color": color });
                    }
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

        const badge = getBadgeTrainingsplit();

        if (badge) {
            document.getElementById("badgesTrainingsplitTableRow").innerHTML += badge;
        }

    }

    /// ------------ end of displayTrainingsplit --------------- ///

}

 // end of displayInformation