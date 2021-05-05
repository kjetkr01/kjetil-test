async function requestTrainingsplitDetails() {

    try {

        const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));

        if (trainingsplit.id) {

            document.getElementById("smallTitle").innerHTML = `<div>
                <svg class="backBtnIcon iconsDefaultColor pointer" draggable="false"
                   onclick="sessionStorage.removeItem('trainingsplit');location.reload();" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.49 39.22">
                   <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                         <polyline class="cls-1" points="21.25 1.24 2.48 20.02 20.45 37.99" />
                      </g>
                   </g>
                </svg>
             </div>`;

            const infoHeader = { "trainingsplit_id": trainingsplit.id };
            const url = `/user/get/trainingsplit`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp) {

                if (resp.canEdit === true && trainingsplit.edit === true) {
                    loadEditTrainingsplit(resp, trainingsplit.day);
                } else {
                    loadViewTrainingsplit(resp, trainingsplit.day);
                }

            } else {
                smallTitle.innerHTML = `Kunne ikke hente planen!`;
                setTimeout(() => {
                    sessionStorage.removeItem("trainingsplit");
                    location.reload();
                }, 2000);
            }
        } else {
            sessionStorage.removeItem("trainingsplit");
            location.reload();
        }


    } catch {
        sessionStorage.removeItem("trainingsplit");
        location.reload();
    }
}

function loadEditTrainingsplit(aResp, aSelectedDay) {

    const resp = aResp;
    const selectedDay = resp[aSelectedDay];

    console.log(selectedDay);

    const top = `<br><h3>Redigerer:</h3><input class="trainingsplitNameInput" maxlength="20" value="${resp.trainingsplit_name}"></input>`;

    const EDays = {
        "monday": "Mandag",
        "tuesday": "Tirsdag",
        "wednesday": "Onsdag",
        "thursday": "Torsdag",
        "friday": "Fredag",
        "saturday": "Lørdag",
        "sunday": "Søndag"
    }

    let optionsHTML = "";

    const EDaysKeys = Object.keys(EDays);
    for (let i = 0; i < EDaysKeys.length; i++) {

        if (EDaysKeys[i] === aSelectedDay) {
            optionsHTML += `<option selected value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
        } else {
            optionsHTML += `<option value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
        }
    }

    const daysList = `Velg dag: <select id="trainingsplitSelectDay" onChange="changeTrainingsplitDay();" class="trainingsplitSelect pointer">${optionsHTML}</select>`;

    document.getElementById("smallTitle").innerHTML += top + daysList;

    const toolBarHTML = `
    <button class="trainingsplitButton pointer">Lagre</button>
    <button class="trainingsplitButton pointer">Ny øvelse</button>
    <button class="trainingsplitButton pointer" style="color:red;" onClick="deleteTrainingsplit('${resp.trainingsplit_id}');">Slett</button>`;

    const backToTopBtn = `<button class="trainingsplitButton pointer" onClick="document.getElementById('GuserGrid').scrollTop = 0;">Tilbake til toppen</button>`;

    document.getElementById("userGrid").innerHTML = `
    <div id="trainingsplitDiv">
    <p id="trainingsplitToolBar">${toolBarHTML}</p>
    <br>
    <p id="trainingsplitInfo"></p>
    <p id="trainingsplitTable"></p>
    <br><br>
    <p id="trainingsplitBottom">${backToTopBtn}</p>
    </div>`;

    const monday = {
        "short": "Bryst og Triceps",
        "list": {
            "Benkpress": [
                { "sets": 3, "reps": 5, "number": 7, "value": 2 },
                { "sets": 2, "reps": 1, "number": 85, "value": 1 },
                { "sets": 1, "reps": 1, "number": 120, "value": 0 }
            ],
            "Markløft": [
                { "sets": 1, "reps": 2, "number": 9, "value": 2 },
                { "sets": 2, "reps": 1, "number": 85, "value": 1 },
                { "sets": 1, "reps": 1, "number": 120, "value": 0 }
            ]
        }
    }

    let shortTxt = "";

    if (selectedDay.short) {
        shortTxt = `Forkortelse på planen: ${selectedDay.short || ""}<br><br>`;
    }

    document.getElementById("trainingsplitInfo").innerHTML = `<p>${shortTxt}Format: 2 x 3 = 2 Sets, 3 Reps.<br>80 % = 80 % av 1 Rep/ORM i øvelsen (krever ORM i løftet)</p>`;

    if (selectedDay.list) {

        const selectedDayKeys = Object.keys(selectedDay.list);

        for (let i = 0; i < selectedDayKeys.length; i++) {
            const exerciseInfo = selectedDay["list"][selectedDayKeys[i]];
            const trainingsplitTable = document.getElementById("trainingsplitTable");
            trainingsplitTable.innerHTML += `<br><h3>${selectedDayKeys[i]}</h3><hr class="trainingsplitLine">`;

            for (let j = 0; j < exerciseInfo.length; j++) {
                const info = exerciseInfo[j];

                const list = {
                    0: "kg",
                    1: "%",
                    2: "RPE",
                    3: "Ingen"
                }

                let optionsHTMLList = "";

                const listKeys = Object.keys(list);

                for (let x = 0; x < listKeys.length; x++) {

                    const num = parseInt(listKeys[x]);

                    if (num === info.value) {
                        optionsHTMLList += `<option selected value="${num}">${list[listKeys[x]]}</option>`;
                    } else {
                        optionsHTMLList += `<option value="${num}">${list[listKeys[x]]}</option>`;
                    }
                }

                trainingsplitTable.innerHTML += `
            <p class="trainingsplitListRow">
            ${j + 1}.
            <input class="trainingsplitSetsInput" maxlength="2" value="${info.sets}"></input>
            x
            <input class="trainingsplitRepsInput" maxlength="2" value="${info.reps}"></input>

            <input class="trainingsplitInput" maxlength="6" value="${info.number}"></input>

            <select class="trainingsplitSelect pointer">
            ${optionsHTMLList}
            </select>

            <button class="trainingsplitButton pointer" style="color:red;">Slett</button>
            </p>
            <hr class="trainingsplitSmallLine">`;
            }

            trainingsplitTable.innerHTML += `<p><button class="trainingsplitButton pointer">Ny rad</button></p>`;
        }
    }
}

function loadViewTrainingsplit(aResp, aSelectedDay) {
    const resp = aResp;

    //const selectedDay = resp[aSelectedDay];

    const monday = {
        "short": "Bryst og Triceps",
        "list": {
            "Benkpress": [
                { "sets": 3, "reps": 5, "number": 7, "value": 2 },
                { "sets": 2, "reps": 1, "number": 85, "value": 1 },
                { "sets": 1, "reps": 1, "number": 120, "value": 0 }
            ],
            "Markløft": [
                { "sets": 1, "reps": 2, "number": 9, "value": 2 },
                { "sets": 2, "reps": 1, "number": 85, "value": 1 },
                { "sets": 1, "reps": 1, "number": 120, "value": 3 }
            ]
        }
    }

    selectedDay = monday;

    console.log(selectedDay)

    const EDays = {
        "monday": "Mandag",
        "tuesday": "Tirsdag",
        "wednesday": "Onsdag",
        "thursday": "Torsdag",
        "friday": "Fredag",
        "saturday": "Lørdag",
        "sunday": "Søndag"
    }

    let optionsHTML = "";

    const EDaysKeys = Object.keys(EDays);
    for (let i = 0; i < EDaysKeys.length; i++) {

        if (EDaysKeys[i] === aSelectedDay) {
            optionsHTML += `<option selected value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
        } else {
            optionsHTML += `<option value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
        }
    }

    const daysList = `Velg dag: <select id="trainingsplitSelectDay" onChange="changeTrainingsplitDay();" class="trainingsplitSelect pointer">${optionsHTML}</select>`;

    const backToTopBtn = `<button class="trainingsplitButton pointer" onClick="document.getElementById('GuserGrid').scrollTop = 0;">Tilbake til toppen</button>`;

    document.getElementById("userGrid").innerHTML = `
    <div id="trainingsplitDiv">
    <p id="trainingsplitToolBar"></p>
    <br>
    <p id="trainingsplitInfo"></p>
    <p id="trainingsplitTable"></p>
    <br><br>
    <p id="trainingsplitBottom">${backToTopBtn}</p>
    </div>`;

    let creatorTxt = "";

    if (userID !== resp.user_id) {
        creatorTxt = `Av: ${resp.creator}<br>`;
        document.getElementById("trainingsplitToolBar").innerHTML += `
        <button class="trainingsplitButton pointer">Kopier</button>
        <button class="trainingsplitButton pointer">Abonner</button>`;
    }

    document.getElementById("smallTitle").innerHTML += `<br><h3>${resp.trainingsplit_name}</h3>${creatorTxt}${daysList}`;

    if (selectedDay.list) {

        const selectedDayKeys = Object.keys(selectedDay.list);

        for (let i = 0; i < selectedDayKeys.length; i++) {
            const exerciseInfo = selectedDay["list"][selectedDayKeys[i]];
            const trainingsplitTable = document.getElementById("trainingsplitTable");
            trainingsplitTable.innerHTML += `<br><h3>${selectedDayKeys[i]}</h3><hr class="trainingsplitLine">`;

            for (let j = 0; j < exerciseInfo.length; j++) {
                const info = exerciseInfo[j];

                const list = {
                    0: "kg",
                    1: "%",
                    2: "RPE",
                    3: "Ingen"
                }

                const listKeys = Object.keys(list);

                let type = "";

                for (let x = 0; x < listKeys.length; x++) {

                    const num = parseInt(listKeys[x]);

                    if (num === info.value) {
                        type = list[listKeys[x]];
                    }
                }

                let extraHTML = `
                <p class="trainingsplitInput trainingsplitInline" style="margin-left:30px;">${info.number}</p>

                <p class="trainingsplitInline">${type}</p>
                `;

                if (type === list[3]) {
                    extraHTML = "";
                }

                if (type === list[1]) {
                    //calc % out of 1RM if exists.

                    const exercise = selectedDayKeys[i].toLowerCase();
                    const cachedLiftsList = JSON.parse(localStorage.getItem("cachedLifts_owner"));

                    if (cachedLiftsList) {
                        const exerciseList = cachedLiftsList[exercise];
                        if (exerciseList) {
                            if (exerciseList.length > 0) {
                                let highestKG = 0;
                                for (let z = 0; z < exerciseList.length; z++) {
                                    const current = exerciseList[z];

                                    if (current.reps === "1") {
                                        if (parseFloat(current.kg) > highestKG) {
                                            highestKG = parseFloat(current.kg);
                                        }
                                    }
                                }

                                if (highestKG > 0) {

                                    const indecimal = info.number / 100;
                                    let weightBasedOnPercent = parseFloat(highestKG * indecimal);
                                    const split = weightBasedOnPercent.toString().split(".");

                                    if (split.length > 1) {
                                        weightBasedOnPercent = weightBasedOnPercent.toFixed(2);
                                    }

                                    extraHTML = `
                                    <p class="trainingsplitInline" style="margin-left:30px;">${weightBasedOnPercent}</p>
                                    <p class="trainingsplitInline">kg (${info.number}%)</p>
                                    `;
                                }
                            }
                        }
                    }
                }

                trainingsplitTable.innerHTML += `
            <p class="trainingsplitListRow trainingsplitInline">
            ${j + 1}.
            <p class="trainingsplitInline" style="margin-left:30px;">${info.sets}</p>
            x
            <p class="trainingsplitInline">${info.reps}</p>
            ${extraHTML}
            </p>
            <hr class="trainingsplitSmallLine">`;
            }
        }
    }
}

function viewTrainingsplit(aId, aDay) {

    let day = "monday";

    const EDays = {
        "monday": "Mandag",
        "tuesday": "Tirsdag",
        "wednesday": "Onsdag",
        "thursday": "Torsdag",
        "friday": "Fredag",
        "saturday": "Lørdag",
        "sunday": "Søndag"
    }

    const EDaysKeys = Object.keys(EDays);
    for (let i = 0; i < EDaysKeys.length; i++) {

        if (EDays[EDaysKeys[i]] === aDay) {
            day = EDaysKeys[i];
        }
    }

    sessionStorage.setItem("trainingsplit", JSON.stringify({ "id": aId, "edit": false, "day": day }));

    location.reload();

}

function changeTrainingsplitDay() {
    const trainingsplitSelectDay = document.getElementById("trainingsplitSelectDay");

    const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));
    trainingsplit.day = trainingsplitSelectDay.value;

    sessionStorage.setItem("trainingsplit", JSON.stringify(trainingsplit));

    location.reload();
}