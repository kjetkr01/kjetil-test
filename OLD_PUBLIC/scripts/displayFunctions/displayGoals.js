function displayGoals() {

    if (Object.entries(goals).length > 0) {

        let keys = Object.keys(goals);
        list.innerHTML = "<tr>";

        if (keys.length > 0) {
            listTitle.innerHTML = "Mål<hr>"
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