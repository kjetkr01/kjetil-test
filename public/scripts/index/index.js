let lifts = null, goals = null, badgeColorsJSON = null;

// usage : partOfDayMessage("Kjetil Kristiansen")

function partOfDayMessage(displayName) {

    let message = "";
    let messageWithName = true;
    let partOfDay = "";
    let firstName = "";

    if (!displayName || displayName.length < 3) {
        messageWithName = false;
    } else {
        firstName = displayName.split(" ");
        firstName = firstName[0];
    }

    const today = new Date();

    const hours = today.getHours();

    if (hours >= 0 && hours <= 4) {
        partOfDay = "natt";
    }
    else if (hours > 4 && hours <= 10) {
        partOfDay = "morgen";
    }
    else if (hours > 10 && hours <= 18) {
        partOfDay = "ettermiddag";
    }
    else if (hours > 18 && hours <= 24) {
        partOfDay = "kveld";
    }

    if (messageWithName) {
        message = `God ${partOfDay},`;
    } else {
        message = `God ${partOfDay}.`;
    }

    return { "message": message, "firstName": firstName };
}


async function whoIsWorkingOutToday() {

    let info = {};

    if (user) {

        const infoHeader = {};
        const url = `/whoIsWorkingOutToday`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp) {
            info = resp;
        }

    }

    return info;

}

function displayPartOfDayMsg() {

    if (user) {
        const partOfDayMsg = partOfDayMessage(user.getDisplayname());
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

    const cached_peopleWorkoutTxt = sessionStorage.getItem("cached_peopleWorkoutTxt");
    if (cached_peopleWorkoutTxt || !navigator.onLine) {
        peopleWorkoutTxt.classList = "noselect";
        peopleWorkoutTxt.innerHTML = cached_peopleWorkoutTxt;
    }

    currentDayInfo();

    if (navigator.onLine) {

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
               <button id="workout-${resp[i].todaysWorkout}" class="peopleWorkoutListWorkout fadeIn">${resp[i].todaysWorkout}</button>
               <br>
               `;

                    currentWorkout = resp[i].todaysWorkout;
                }

                shortenedFullName = splitFullName[0] + " ";
                for (let j = 1; j < splitFullName.length; j++) {
                    shortenedFullName += `${splitFullName[j][0]}.`;
                }

                if (user && user.getId() === resp[i].id) {
                    const workoutBtn = document.getElementById(`workout-${currentWorkout}`);
                    workoutBtn.classList += " pointer";

                    const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];

                    const dayNum = new Date().getDay();
                    const day = days[dayNum];

                    const link = `sessionStorage.setItem("trainingsplit_return_to_feed", true);viewTrainingsplit('${user.getSetting("activetrainingsplit")}','${day}');`;
                    workoutBtn.setAttribute("onclick", link);
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

        sessionStorage.setItem("cached_peopleWorkoutTxt", peopleWorkoutTxt.innerHTML);

    } else {
        peopleWorkoutTxt.innerHTML = defaultTxt.noConnection;
    }

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

        const cachedGoalsLeft = JSON.parse(localStorage.getItem("cachedGoalsLeft_owner"));

        if (user.getSetting("badgesize") === 1) {
            document.getElementById("Gbadges").style.minHeight = "200px";
        } else {
            document.getElementById("Gbadges").style.minHeight = "110px";
        }

        if (cachedGoalsLeft) {
            goalsLeft = new TgoalsLeft(cachedGoalsLeft);
        }

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

    const resp = await getAccountDetails(user.getId());

    if (resp) {
        if (resp.hasOwnProperty("info")) {
            localStorage.setItem("cachedLifts_owner", JSON.stringify(resp.info.lifts));
            localStorage.setItem("cachedLiftsLeft_owner", resp.info.liftsLeft);
            localStorage.setItem("cachedGoals_owner", JSON.stringify(resp.info.goals));
            localStorage.setItem("cachedGoalsLeft_owner", resp.info.goalsLeft);
            localStorage.setItem("cachedBadgeColors", JSON.stringify(resp.info.badgeColors));
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

    let updateGoals = true, updateBadgeColors = true;

    try {

        const checkExistingLifts = JSON.stringify(lifts);
        const checkUpdatedLifts = JSON.stringify(info.lifts);

        const checkExistingGoals = JSON.stringify(goals);
        const checkUpdatedGoals = JSON.stringify(info.goals);
        const checkUpdatedGoalsFilter = info.settings.goals_filter_exercise;

        const checkExistingBadgeColors = JSON.stringify(badgeColorsJSON);
        const checkUpdatedBadgeColors = JSON.stringify(info.badgeColors);

        if (
            checkExistingLifts === checkUpdatedLifts
            && checkExistingGoals === checkUpdatedGoals
            && info.info.weight === user.getDetail("weight")
            && user.getSetting("badgesize") === info.settings.badgesize
            && user.getSetting("badgedetails") === info.settings.badgedetails
            && checkUpdatedGoalsFilter === user.getSetting("goals_filter_exercise")) {
            updateGoals = false;
        }

        if (checkExistingBadgeColors === checkUpdatedBadgeColors) {
            updateBadgeColors = false;
        }

    } catch {

    }

    if (updateBadgeColors === true) {
        badgeColorsJSON = info.badgeColors;
        badgeColors = new TbadgeColors(info.badgeColors);
    }

    if (user.getSetting("lifts_filter_exercise") !== info.settings.lifts_filter_exercise) {
        user.changeSetting("lifts_filter_exercise", info.settings.lifts_filter_exercise);
    }

    if (updateGoals === true) {
        if (user.getSetting("badgesize") !== info.settings.badgesize) {
            user.changeSetting("badgesize", info.settings.badgesize);
        }
        if (user.getSetting("badgedetails") !== info.settings.badgedetails) {
            user.changeSetting("badgedetails", info.settings.badgedetails);
        }
        if (user.getDetail("weight") !== info.info.weight) {
            user.changeDetail("weight", info.info.weight);
        }
        if (user.getSetting("goals_filter_exercise") !== info.settings.goals_filter_exercise) {
            user.changeSetting("goals_filter_exercise", info.settings.goals_filter_exercise);
        }
        lifts = info.lifts;
        goals = info.goals;
        showGoalBadgeAnimations = true;
        if (user.getSetting("badgesize") === 1) {
            document.getElementById("Gbadges").style.minHeight = "200px";
        } else {
            document.getElementById("Gbadges").style.minHeight = "110px";
        }
    }

    if (updateGoals === true) {
        goalsLeft = new TgoalsLeft(info.goalsLeft);
        goalsInfo = new Tgoals(info.goals);
        displayGoals(true);
    }

}

async function displayGoals(checkIfCompleted) {

    try {

        document.getElementById("badgesTableRow").innerHTML = "";

        const completedGoalsList = {};

        if (checkIfCompleted !== true) {
            checkIfCompleted = false;
        }

        hasGoalsLeft = localStorage.getItem("cachedGoalsLeft_owner") > 0 || false;

        const smallTitle = document.getElementById("smallTitle");

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
                displayPerExercise(exerciseGoal, keys[i]);
            }
        } else {
            const exerciseGoal = showGoals;
            displayPerExercise(exerciseGoal, sortByGoals);
        }

        function displayPerExercise(aExerciseGoal, aCurrent) {

            let kgUntilGoal = 0, repsUntilGoal = 0, msg = "", progressionPercent = 0;;

            const exerciseGoal = aExerciseGoal;
            const current = aCurrent;
            const exerciseGoalKeys = Object.keys(exerciseGoal);

            for (let j = 0; j < exerciseGoalKeys.length; j++) {

                const goalKeys = exerciseGoal[exerciseGoalKeys[j]];

                if (goalKeys) {

                    const id = goalKeys.id;
                    const color = goalKeys.color || "redBadgeG";
                    const goalKg = parseFloat(goalKeys.kg);

                    if (goalKeys.completed !== true) {

                        if (current.includes("i vekt")) {

                            const calcWeight = user.getDetail("weight");

                            if (calcWeight) {

                                if (current.includes("opp i vekt")) {

                                    kgUntilGoal = goalKg - calcWeight;
                                    if (kgUntilGoal <= 0) {
                                        msg = "Målet er nådd!";
                                    } else {
                                        msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                        calcPercent(calcWeight, goalKg);
                                    }
                                } else {

                                    kgUntilGoal = calcWeight - goalKg;
                                    if (kgUntilGoal <= 0) {
                                        msg = "Målet er nådd!";
                                    } else {
                                        msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                        calcPercent(goalKg, calcWeight);
                                    }
                                }

                            } else {
                                msg = "Din vekt kreves";
                            }

                        } else {

                            const goalReps = parseInt(goalKeys.reps);
                            const liftKeys = Object.keys(lifts[current]);

                            let highestLiftKg = { "kg": 0, "reps": 0 };

                            const liftsList = {};

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
                                    } else if (repsUntilGoal === 1) {
                                        msg = `1 rep igjen`;
                                        calcPercent(highestLiftKg.reps, goalReps);
                                    } else {
                                        msg = `${repsUntilGoal} reps igjen`;
                                        calcPercent(highestLiftKg.reps, goalReps);
                                    }
                                } else {
                                    kgUntilGoal = goalKg - highestLiftKg.kg;
                                    if (kgUntilGoal <= 0) {
                                        msg = "Målet er nådd!";
                                    } else {
                                        msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                        calcPercent(highestLiftKg.kg, goalKg);
                                    }
                                }
                            }

                            if (highestLiftKg.kg >= goalKg) {
                                if (liftsList[goalKg]) {
                                    repsUntilGoal = goalReps - liftsList[goalKg];
                                    if (repsUntilGoal <= 0) {
                                        msg = "Målet er nådd!";
                                    } else if (repsUntilGoal === 1) {
                                        msg = `1 rep igjen`;
                                        calcPercent(liftsList[goalKg], goalReps);
                                    } else {
                                        msg = `${repsUntilGoal} reps igjen`;
                                        calcPercent(liftsList[goalKg], goalReps);
                                    }
                                } else if (highestLiftKg.reps >= goalReps && highestLiftKg.kg >= goalKg) {
                                    msg = "Målet er nådd!";
                                } else {
                                    msg = `${goalReps} reps igjen`;
                                    calcPercent(liftsList[goalKg], goalReps);
                                }
                            } else {
                                kgUntilGoal = goalKg - highestLiftKg.kg;
                                msg = `${checkIfDecimal(kgUntilGoal)} kg igjen`;
                                calcPercent(highestLiftKg.kg, goalKg);
                            }
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

                        if (msg === "Målet er nådd!") {
                            progressionPercent = 100;
                        }

                        if (progressionPercent < 0) {
                            progressionPercent = 0;
                        }
                        if (progressionPercent > 100) {
                            progressionPercent = 100;
                        }

                        if (progressionPercent === 100) {
                            if (checkIfCompleted === true) {
                                if (goalKeys.completed !== true) {
                                    if (!completedGoalsList[current]) {
                                        completedGoalsList[current] = [];
                                    }
                                    completedGoalsList[current].push(id);
                                }
                            }
                        }

                    } else {
                        progressionPercent = 100;
                        msg = "Målet er nådd!";
                    }

                    arr.push({ "exercise": capitalizeFirstLetter(current), "kg": goalKg, "msg": msg, "color": color, "id": id, "progressionPercent": progressionPercent });

                }
            }
        }

        if (arr.length > 0) {

            smallTitle.textContent = "Din fremgang";

            arr.sort(function (a, b) { return b.progressionPercent - a.progressionPercent });

            for (let i = 0; i < arr.length; i++) {

                const badge = getBadgeGoals(user.getSetting("badgesize"), arr[i], arr[i].id);

                const badgesGoalsTableRow = document.getElementById("badgesTableRow");

                if (badge && badgesGoalsTableRow) {
                    badgesGoalsTableRow.innerHTML += badge;

                    if (user.getSetting("badgesize") === 1) {

                        const progressCircle = document.getElementById(`${arr[i].exercise}-${arr[i].id}-progress`);

                        if (progressCircle) {

                            //console.log(progressCircle)

                            if (arr[i].progressionPercent >= 100) {

                                const selectedBadge = document.getElementsByClassName(`${arr[i].exercise}-${arr[i].id}-class`);

                                if (selectedBadge.length > 0) {

                                    selectedBadge[0].innerHTML = `
                                    <svg id="placement" class="medals medalIconGold" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                                    <defs>
                                    </defs>
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="Layer_1-2" data-name="Layer 1">
                                            <path class="medalIconGold"
                                                d="M28.33,17.38v-14H11.67V17.38a1.66,1.66,0,0,0,.81,1.44l7,4.18L17.8,26.9l-5.68.48,4.31,3.74-1.31,5.55,4.88-3,4.88,3-1.3-5.55,4.32-3.74-5.68-.48L20.57,23l7-4.18A1.66,1.66,0,0,0,28.33,17.38Zm-6.66,3-1.67,1-1.67-1V5h3.34Z" />
                                        </g>
                                    </g>
                                </svg>
                                `;
                                }
                            } else {

                                const radius = progressCircle.r.baseVal.value;
                                //circumference of a circle = 2πr;
                                const circumference = radius * 2 * Math.PI;
                                progressCircle.style.strokeDasharray = circumference;

                                //0 to 100
                                setProgress(arr[i].progressionPercent);

                                function setProgress(percent) {

                                    const additionalSpace = (percent / 36);
                                    progressCircle.style.strokeDashoffset = (circumference - (percent / 100) * circumference) + additionalSpace;

                                    if (percent >= 66) {
                                        progressCircle.classList += " p66";
                                    } else if (percent >= 33) {
                                        progressCircle.classList += " p33";
                                    } else {
                                        progressCircle.classList += " pstart";
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (navigator.onLine) {
                const completedGoalsListKeys = Object.keys(completedGoalsList);
                if (completedGoalsListKeys.length > 0) {
                    setGoalAsComplete();
                    async function setGoalAsComplete() {
                        const infoHeader = { "completedGoalsList": completedGoalsList };
                        const url = `/user/update/goals/completed`;
                        await callServerAPIPost(infoHeader, url);
                    }
                }
            }

        } else {
            document.getElementById("Gbadges").style.minHeight = "110px";
            smallTitle.textContent = "Du har ingen mål enda!";
        }

        if (hasGoalsLeft === true || Object.entries(goals).length === 0) {

            const badge = getBadgeGoals();

            const badgesGoalsTableRow = document.getElementById("badgesTableRow");

            if (badge && badgesGoalsTableRow) {
                badgesGoalsTableRow.innerHTML += badge;
            }
        }
    } catch (err) {
        console.log(err);
    }
}
