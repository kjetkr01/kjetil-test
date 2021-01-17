// displayInformation
function displayInformation() {

    if (!info) {
        return;
    }

    displayname = info.displayname;
    age = info.info.age;
    height = info.info.height
    weight = info.info.weight;
    program = info.trainingsplit;
    lifts = info.lifts;
    goals = info.goals;

    if(info.settings){
        settings = info.settings;
    }

    const infoList = document.getElementById("infoList");

    if (displayname) {
        document.getElementById("displayname").innerHTML = displayname;
    }
    /* old version
    if (age) {
        infoList.innerHTML = `
        <tr>
        <td>${age} år</td>
        </tr>
        `;
    }
    if (height) {
        infoList.innerHTML += `
        <tr>
        <td>${height} cm</td>
        </tr>
        `;
    }
    if (weight) {
        infoList.innerHTML += `
        <tr>
        <td>${weight} kg</td>
        </tr>
        `;
    }
    */

    // new version

    let infoString = "";

    if (age) {
        infoString += `<td>${age} år</td>`;
    }
    if (height) {
        infoString += `<td>${height} cm</td>`;
    }
    if (weight) {
        infoString += `<td>${weight} kg</td>`;
    }

    if (infoString) {
        infoList.innerHTML = `<tr>${infoString}</tr>`;
    }

    //

    if (program) {

        let dayTxt = "";
        let usermessage = "";

        const day = new Date().getDay();

        switch (day) {
            case 0:
                dayTxt = "Søndag";
                break;
            case 1:
                dayTxt = "Mandag";
                break;
            case 2:
                dayTxt = "Tirsdag";
                break;
            case 3:
                dayTxt = "Onsdag";
                break;
            case 4:
                dayTxt = "Torsdag";
                break;
            case 5:
                dayTxt = "Fredag";
                break;
            case 6:
                dayTxt = "Lørdag";
                break;
        }

        if (program[dayTxt].length > 0 && program[dayTxt] !== "Fri") {
            usermessage = `Trener i dag: ${program[dayTxt]}.`;
        } else {
            usermessage = `Trener ikke i dag.`;
        }

        const checkWorkoutTodayDiv = document.getElementById("workoutToday");

        if(checkWorkoutTodayDiv){
            checkWorkoutTodayDiv.innerHTML = usermessage;
        }

        changelistContent(sessionStorage.getItem("currentListContent"));

    }

}

// end of displayInformation

function displayLifts() {

    if (Object.entries(lifts).length > 0) {

        let keys = Object.keys(lifts);
        list.innerHTML = "<tr>";

        if (keys.length > 0) {

            listTitle.innerHTML = "Løft:<hr>";
            for (let i = 0; i < keys.length; i++) {

                let liftKeys = lifts[keys[i]];

                if (liftKeys.ORM !== "0" && liftKeys.ORM !== 0 && liftKeys.ORM !== "") {

                    let msg = `
                    <td>${keys[i]}: ${liftKeys.ORM} kg</td>
                    `;

                    let prDateArr = liftKeys.PRdate.split(".");

                    if (prDateArr.length === 3) {

                        if (prDateArr[0] > 0 && prDateArr[0] <= 31 && prDateArr[0].length <= 2 && prDateArr[1] > 0 && prDateArr[1] <= 12 && prDateArr[1].length <= 2 && prDateArr[2].length === 4) {

                            const d = new Date();

                            const prDate = new Date(prDateArr[2], (prDateArr[1] - 1), prDateArr[0]);

                            function calcTime() {
                                let daysSinceTime = (d - prDate) / (1000 * 3600 * 24);
                                return parseInt(daysSinceTime);
                            }

                            /*
                            msg = `
                            <td>${keys[i]}: ${liftKeys.ORM} kg
                            <br>
                            Dato: ${liftKeys.PRdate}
                            <br>
                            Dager siden: ${calcTime()}</td>`;
                            */
                            /*
                            msg = `
                            <td>
                            ${keys[i]}:
                            <br>
                            PR Dato:
                            <br>
                            </td>
                            <td>
                            ${liftKeys.ORM} kg
                            <br>
                            ${liftKeys.PRdate}
                            <br>
                            ${calcTime()} dager siden
                            </td>`;
                            */

                            msg = `
                            <td>
                            ${keys[i]}
                            <br>
                            ${liftKeys.ORM} kg
                            </td>
                            <td>
                            ${liftKeys.PRdate}
                            <br>
                            ${calcTime()} dager siden
                            </td>`;
                        }

                    }

                    list.innerHTML += msg;
                }
            }

            list.innerHTML += "</tr>"

            if (lifts.Benkpress && lifts.Knebøy && lifts.Markløft) {

                let Benkpress = lifts.Benkpress.ORM;
                let Knebøy = lifts.Knebøy.ORM;
                let Markløft = lifts.Markløft.ORM;

                if (Benkpress !== "0" && Benkpress !== 0 && Benkpress !== "") {
                    if (Knebøy !== "0" && Knebøy !== 0 && Knebøy !== "") {
                        if (Markløft !== "0" && Markløft !== 0 && Markløft !== "") {

                            Benkpress = parseFloat(Benkpress);
                            Knebøy = parseFloat(Knebøy);
                            Markløft = parseFloat(Markløft);

                            const totalORM = (Benkpress + Knebøy + Markløft);

                            document.getElementById("showTotalLift").innerHTML = `PR Totalt: <br> ${totalORM.toFixed(2)} kg | ${(totalORM * 2.2).toFixed(2)} lbs`;

                        }
                    }
                }

            }

        }
    }

}

function displayGoals() {

    if (Object.entries(goals).length > 0) {

        let keys = Object.keys(goals);
        list.innerHTML = "<tr>";

        if (keys.length > 0) {
            listTitle.innerHTML = "Mål:<hr>"
            for (let i = 0; i < keys.length; i++) {

                let liftKeys = goals[keys[i]];

                if (liftKeys.goal !== "0" && liftKeys.goal !== 0 && liftKeys.goal !== "") {

                    let msg = `
                    <td>${keys[i]}: ${liftKeys.goal} kg</td>
                    `;

                    let prDateArr = liftKeys.Goaldate.split(".");

                    if (prDateArr.length === 3) {

                        if (prDateArr[0] > 0 && prDateArr[0] <= 31 && prDateArr[0].length <= 2 && prDateArr[1] > 0 && prDateArr[1] <= 12 && prDateArr[1].length <= 2 && prDateArr[2].length === 4) {

                            const d = new Date();

                            const prDate = new Date(prDateArr[2], (prDateArr[1] - 1), prDateArr[0]);

                            function calcTime() {
                                let daysSinceTime = (d - prDate) / (1000 * 3600 * 24);
                                return parseInt(daysSinceTime);
                            }

                            if (liftKeys.goal && lifts[keys[i]]) {

                                let PRnum = parseFloat(lifts[keys[i]].ORM);
                                let goalnum = parseFloat(liftKeys.goal);

                                if (PRnum < goalnum) {
                                    let untilGoalCalcKG = goalnum;

                                    if (PRnum !== 0) {
                                        untilGoalCalcKG = goalnum - PRnum;
                                    }

                                    let untilGoal = `${untilGoalCalcKG} kg`;

                                    /*
                                    msg = `
                                    <td>${keys[i]}: ${liftKeys.goal} kg
                                    <br>
                                    Ifra målet: ${untilGoal}
                                    <br>
                                    Dato: ${liftKeys.Goaldate}
                                    <br>
                                    Dager siden: ${calcTime()}</td>
                                    `;
                                    */
                                    msg = `
                                    <td>
                                    ${keys[i]}
                                    <br>
                                    ${liftKeys.goal} kg (+${untilGoal})
                                    </td>
                                    <td>
                                    ${liftKeys.Goaldate}
                                    <br>
                                    ${calcTime()} dager siden
                                    </td>`;

                                } else {
                                    /*
                                    msg = `
                                    <td>${keys[i]}: ${liftKeys.goal} kg
                                    <br>
                                    Dato: ${liftKeys.Goaldate}
                                    <br>
                                    Dager siden: ${calcTime()}</td>
                                    `;
                                    */
                                    msg = `
                                    <td>
                                    ${keys[i]}
                                    <br>
                                    ${liftKeys.goal} kg
                                    </td>
                                    <td>
                                    ${liftKeys.Goaldate}
                                    <br>
                                    ${calcTime()} dager siden
                                    </td>`;

                                }

                            } else {
                                /*
                                msg = `
                                <td>${keys[i]}: ${liftKeys.goal} kg
                                <br>
                                Dato: ${liftKeys.Goaldate}
                                <br>
                                Dager siden: ${calcTime()}</td>
                                `;*/
                                msg = `
                                <td>
                                ${keys[i]}
                                <br>
                                ${liftKeys.goal} kg
                                </td>
                                <td>
                                ${liftKeys.Goaldate}
                                <br>
                                ${calcTime()} dager siden
                                </td>`;

                            }
                        }

                    }

                    list.innerHTML += msg;
                }
            }

            list.innerHTML += "</tr>";

            if (goals.Benkpress && goals.Knebøy && goals.Markløft) {

                let Benkpress = goals.Benkpress.goal;
                let Knebøy = goals.Knebøy.goal;
                let Markløft = goals.Markløft.goal;

                if (Benkpress !== "0" && Benkpress !== 0 && Benkpress !== "") {
                    if (Knebøy !== "0" && Knebøy !== 0 && Knebøy !== "") {
                        if (Markløft !== "0" && Markløft !== 0 && Markløft !== "") {

                            Benkpress = parseFloat(Benkpress);
                            Knebøy = parseFloat(Knebøy);
                            Markløft = parseFloat(Markløft);

                            const totalORM = (Benkpress + Knebøy + Markløft);

                            document.getElementById("showTotalLift").innerHTML = `Mål Totalt: <br> ${totalORM.toFixed(2)} kg | ${(totalORM * 2.2).toFixed(2)} lbs`;

                        }
                    }
                }

            }

        }
    }

}

function displayProgram() {

    if (Object.entries(program).length > 0) {

        let keys = Object.keys(program);
        list.innerHTML = "<tr>";

        if (keys.length > 0) {
            listTitle.innerHTML = "Treningsplan:<hr>"
            for (let i = 0; i < keys.length; i++) {

                let liftKeys = program[keys[i]];

                if (liftKeys !== "0" && liftKeys !== 0 && liftKeys !== "") {

                    let msg = `
                    <td>${keys[i]}:</td><td>${liftKeys}</td>
                    `;

                    list.innerHTML += msg;
                }
            }

        }

        list.innerHTML += "</tr>";
    }

}