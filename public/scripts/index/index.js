"use strict";
let lifts = null,
    goals = null,
    badgeColorsJSON = null;

// usage : partOfDayMessage("Kjetil Kristiansen")
// displays part of day message, example: God morgen, Kjetil
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
// End of partOfDayMessage function

// displays part of day message
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
// End of displayPartOfDayMsg

// gets a list of everyone that is working out today and what they are working out
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

        const infoHeader = {};
        const url = `/whoIsWorkingOutToday`;

        const resp = await callServerAPIPost(infoHeader, url);

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

                    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

                    const dayNum = new Date().getDay();
                    const day = days[dayNum];

                    const link = `redirectToTrainingsplit('${user.getSetting("activetrainingsplit")}','${day}');`;
                    workoutBtn.setAttribute("onclick", link);
                    peopleWorkoutList.innerHTML += `
                    <button class="accountOwner fadeInUp animate pointer" onClick="redirectToUser('${resp[i].id}')">${shortenedFullName}</button>
                    <br>
                    `;

                } else {
                    peopleWorkoutList.innerHTML += `
            <button class="peopleWorkoutListName fadeInUp animate pointer" onClick="redirectToUser('${resp[i].id}')">${shortenedFullName}</button>
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
// End of checkWhoIsWorkingOutToday function

// displays current day info, example: Torsdag 17. Juni
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
// End of currentDayInfo function

// requests account details
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
}
// End of requestAccountDetails

// displayBadges
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
// End of displayBadges function

// displays goals if user has any
async function displayGoals(checkIfCompleted) {

    try {

        document.getElementById("badgesTableRow").innerHTML = "";

        const completedGoalsList = {};

        if (checkIfCompleted !== true) {
            checkIfCompleted = false;
        }

        let hasGoalsLeft = localStorage.getItem("cachedGoalsLeft_owner") > 0 || false;

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
                pushToArrPerExerciseGoal(exerciseGoal, keys[i], checkIfCompleted, completedGoalsList, arr);
            }
        } else {
            const exerciseGoal = showGoals;
            pushToArrPerExerciseGoal(exerciseGoal, sortByGoals, checkIfCompleted, completedGoalsList, arr);
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
// End of displayGoals function