function displayLifts() {

    if (Object.entries(lifts).length > 0) {

        let keys = Object.keys(lifts);
        list.innerHTML = "<tr>";

        if (keys.length > 0) {

            listTitle.innerHTML = "Løft<hr>";
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