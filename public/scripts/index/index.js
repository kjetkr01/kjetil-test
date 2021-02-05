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

    const resp = await whoIsWorkingOutToday();

    currentDayInfo();

    peopleWorkoutList.innerHTML = "";
    peopleWorkoutTxt.innerHTML = "";

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

            if (username === resp[i].username) {
                peopleWorkoutList.innerHTML += `
                <button class="accountOwner fadeIn" onClick="viewUser('${resp[i].username}')">${shortenedFullName}</button>
                <br>
                `;

            } else {

                peopleWorkoutList.innerHTML += `
            <button class="peopleWorkoutListName fadeIn" onClick="viewUser('${resp[i].username}')">${shortenedFullName}</button>
            <br>
            `;

            }

        }

    } else {
        peopleWorkoutTxt.innerHTML = `I dag er det ingen som trener`;
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

/*
   const numb = document.getElementById("percentNum");
   let counter = 0;
   let max = 23;
 
   setInterval(() => {
      if (counter === 100 || counter >= max) {
         clearInterval();
        
      } else {
         counter += 1;
         numb.textContent = counter + "%";
      }
   }, 20);
*/

async function displayBadges() {

    let myUsername = JSON.parse(user);
    myUsername = myUsername.username;

    const smallTitle = document.getElementById("smallTitle");

    const body = { "authToken": token, "userInfo": user, "viewingUser": myUsername };
    const url = `/users/details/${myUsername}`;

    const resp = await callServerAPI(body, url);

    if (resp.info && resp.updatedUserObject) {

        if (localStorage.getItem("user")) {
            localStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
        } else {
            sessionStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
        }

        const size = 0;

        if (size === 1) {
            document.getElementById("Gbadges").style.minHeight = "180px";
        }


        const lifts = resp.info.lifts;
        const goals = resp.info.goals;

        const badgesTableRowDom = document.getElementById("badgesTableRow");
        badgesTableRowDom.innerHTML = "";

        if (Object.entries(goals).length > 0) {

            const goalKeys = Object.keys(goals);

            const arr = []
            let kgUntilGoal = 0, msg = "";

            for (let i = 0; i < Object.entries(goals).length; i++) {

                if (goalKeys[i]) {

                    if (goals[goalKeys[i]].goal > 0) {

                        const currentGoalPR = parseFloat(goals[goalKeys[i]].goal);
                        let currentLiftPR = 0;

                        if (lifts[goalKeys[i]]) {
                            currentLiftPR = parseFloat(lifts[goalKeys[i]].ORM);
                        }

                        kgUntilGoal = currentGoalPR - currentLiftPR;

                        if (kgUntilGoal < 0) {
                            msg = "Målet er nådd!";
                        } else {
                            msg = `${kgUntilGoal} kg igjen`;
                        }

                        arr.push({ "exercise": goalKeys[i], "kg": currentGoalPR, "kgLeft": kgUntilGoal, "msg": msg });
                    }
                }

            }

            arr.sort(function (a, b) { return a.kgLeft - b.kgLeft });

            smallTitle.textContent = "Din fremgang";

            for (let i = 0; i < arr.length; i++) {

                const badge = getBadge(size, arr[i]);

                if (badge) {
                    badgesTableRowDom.innerHTML += badge;
                }
            }
        } else {
            const badge = getBadge();

            smallTitle.textContent = "Du har ingen mål enda!";

            if (badge) {
                badgesTableRowDom.innerHTML = badge;
            }
        }
    }
}

