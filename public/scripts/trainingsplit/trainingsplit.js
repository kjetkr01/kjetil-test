let showTrainingsplitAnimations = true;
async function requestTrainingsplitDetails() {

    try {

        const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));

        if (trainingsplit.id) {

            document.title = `Treningsplan`;

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

            let resp = null;
            if (trainingsplit.edit !== true) {
                const cachedActiveTrainingsplit_owner = JSON.parse(localStorage.getItem("cachedActiveTrainingsplit_owner"));
                if (cachedActiveTrainingsplit_owner) {
                    if (cachedActiveTrainingsplit_owner.trainingsplit_id === parseInt(trainingsplit.id)) {
                        showTrainingsplitAnimations = false;
                        resp = JSON.parse(localStorage.getItem("cachedActiveTrainingsplit_owner"));
                    }
                }
            }

            if (navigator.onLine && resp === null) {

                const infoHeader = { "trainingsplit_id": trainingsplit.id };
                const url = `/user/get/trainingsplit`;

                resp = await callServerAPIPost(infoHeader, url);
            }

            if (resp) {

                document.title = `Treningsplan (${resp.trainingsplit_name})`;

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


    } catch (err) {
        console.log(err);
        sessionStorage.removeItem("trainingsplit");
        location.reload();
    }
}
const exerciseListCount = {};
function loadEditTrainingsplit(aResp, aSelectedDay) {

    const resp = aResp;

    const selectedDay = resp[aSelectedDay];

    const top = `<br><h3>Redigerer:</h3><input id="trainingsplitNameInp" class="trainingsplitNameInput" maxlength="20" value="${resp.trainingsplit_name}"></input>`;

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

    const cachedLifts_owner = JSON.parse(localStorage.getItem("cachedLifts_owner"));


    const exercisesList = [];

    if (cachedLifts_owner) {
        const cachedLifts_ownerKeys = Object.keys(cachedLifts_owner);
        for (let i = 0; i < cachedLifts_ownerKeys.length; i++) {
            exercisesList.push(capitalizeFirstLetter(cachedLifts_ownerKeys[i]));
        }
    }

    let exerciseListOptionsHTML = "";

    for (let v = 0; v < exercisesList.length; v++) {
        exerciseListOptionsHTML += `<option value="${exercisesList[v]}">${exercisesList[v]}</option>`;
    }

    document.getElementById("smallTitle").innerHTML += top + daysList;
    //<button class="trainingsplitButton pointer" style="color:red;" onClick="deleteTrainingsplit('${resp.trainingsplit_id}');">Slett</button>
    const toolBarHTML = `
    <button id="saveTrainingsplitBtn" class="trainingsplitButton pointer" onClick="saveTrainingsplit();">Lagre</button>
    <button class="trainingsplitButton pointer" style="color:red;" onClick="deleteTrainingsplit('${resp.trainingsplit_id}');"><img src="images/trash.svg"></img></button>
    <br>
    <br>
    <select id="selectNewExercise" class="trainingsplitSelect pointer">
    <option value=null>Velg øvelse her</option>
    ${exerciseListOptionsHTML}
    </select>
    eller fyll inn
    <input id="inputNewExercise" class="trainingsplitNameInput" maxlength="30" placeholder="Øvelse"></input>

    <button class="trainingsplitButton pointer" onClick="addExercise();">Legg til øvelse</button>
    `;

    document.getElementById("userGrid").innerHTML = `
    <div id="trainingsplitDiv">
    <p id="trainingsplitToolBar">${toolBarHTML}</p>
    <br>
    <p id="trainingsplitInfo"></p>
    <p id="trainingsplitTable"></p>
    <br><br>
    <p id="trainingsplitBottom"></p>
    </div>`;

    let shortTxt = "";

    document.getElementById("trainingsplitInfo").innerHTML = `<p>${shortTxt}Format: 2 x 3 = 2 Sets, 3 Reps.<br>80 % = 80 % av 1 Rep/ORM i øvelsen (krever ORM i løftet for automatisk utregning)</p>`;

    if (selectedDay.list) {

        const arr = selectedDay.list;

        for (let i = 0; i < arr.length; i++) {

            const exerciseInfo = arr[i];
            const exerciseName = Object.keys(arr[i])[0];
            const exerciseList = exerciseInfo[exerciseName];

            const trainingsplitTable = document.getElementById("trainingsplitTable");
            //<button class="trainingsplitButton pointer" style="color:red;" onClick="deleteExercise('${exerciseName}');">Slett</button></h3>

            trainingsplitTable.innerHTML += `
            <br><h3 class="fadeInUp animate">${exerciseName}
            <button class="trainingsplitButton pointer" style="color:red;" onClick="deleteExercise('${exerciseName}');"><img src="images/trash.svg"></button></h3>
            <hr class="trainingsplitLine fadeInUp animate">`;

            exerciseListCount[exerciseName] = exerciseList.length;

            for (let j = 0; j < exerciseList.length; j++) {
                const info = exerciseList[j];

                const list = {
                    0: "Ingen",
                    1: "kg",
                    2: "%",
                    3: "RPE"
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
            <p class="trainingsplitListRow fadeInUp animate delaySmall">
            ${j + 1}.
            <input id="${exerciseName}-${j}-sets" class="trainingsplitSetsInput" maxlength="2" value="${info.sets}"></input>
            x
            <input id="${exerciseName}-${j}-reps" class="trainingsplitRepsInput" maxlength="2" value="${info.reps}"></input>

            <input id="${exerciseName}-${j}-number" class="trainingsplitInput" maxlength="6" value="${info.number}"></input>

            <select id="${exerciseName}-${j}-value" class="trainingsplitSelect pointer">
            ${optionsHTMLList}
            </select>
    
            <button class="trainingsplitButton pointer" style="color:red;" onClick="deleteRowExercise('${exerciseName}', ${j});"><img src="images/trash.svg"></button>
            </p>
            <hr class="trainingsplitSmallLine fadeInUp animate delayMedium">`;
            }

            trainingsplitTable.innerHTML += `<p><button class="trainingsplitButton pointer" onClick="addRowExercise('${exerciseName}');">Ny rad</button></p>`;
        }
    }

    const GuserGrid = document.getElementById("GuserGrid");

    if (GuserGrid.scrollHeight > (GuserGrid.clientHeight + 600)) {
        const backToTopBtn = `<button class="trainingsplitButton pointer" onClick="document.getElementById('GuserGrid').scrollTop = 0;">Tilbake til toppen</button>`;
        document.getElementById("trainingsplitBottom").innerHTML = backToTopBtn;
    }

    if (sessionStorage.getItem("usergrid_scroll_y_edit")) {
        GuserGrid.scrollTop = sessionStorage.getItem("usergrid_scroll_y_edit");
    }

    GuserGrid.addEventListener("scroll", function () {
        const scrollY = GuserGrid.scrollTop;
        sessionStorage.setItem("usergrid_scroll_y_edit", scrollY);
    });
}

function loadViewTrainingsplit(aResp, aSelectedDay) {

    const resp = aResp;

    let selectedDay = resp[aSelectedDay];

    const ORMLifts = [];

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
        if (resp[EDaysKeys[i]].short.length > 0 || EDaysKeys[i] === aSelectedDay) {
            if (EDaysKeys[i] === aSelectedDay) {
                selectedDay = resp[aSelectedDay];
                optionsHTML += `<option selected value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
            } else {
                optionsHTML += `<option value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
            }
        }
    }

    const daysList = `Velg dag: <select id="trainingsplitSelectDay" onChange="changeTrainingsplitDay();" class="trainingsplitSelect pointer">${optionsHTML}</select>`;

    document.getElementById("userGrid").innerHTML = `
    <div id="trainingsplitDiv">
    <p id="trainingsplitToolBar"></p>
    <br>
    <p id="trainingsplitInfo"></p>
    <p id="trainingsplitTable"></p>
    <br><br>
    <p id="trainingsplitBottom"></p>
    </div>`;

    let creatorTxt = "";

    if (userID !== resp.user_id) {

        const cachedSubscribedTrainingsplits_owner = JSON.parse(sessionStorage.getItem("cachedSubscribedTrainingsplits_owner"));

        let isSubscribed = false;

        if (cachedSubscribedTrainingsplits_owner) {
            if (Object.keys(cachedSubscribedTrainingsplits_owner).includes(resp.trainingsplit_id.toString())) {
                isSubscribed = true;
            }
        }

        let subscribeHTML = `<button class="trainingsplitButton pointer" onClick="subOrUnsubToTrainingsplit(${resp.trainingsplit_id}, ${resp.user_id}, '${resp.trainingsplit_name}');">Abonner</button>`;

        if (!navigator.onLine) {
            subscribeHTML = `<button disabled class="trainingsplitButton">Abonner</button>`;
        }

        if (isSubscribed === true) {
            subscribeHTML = `<button class="trainingsplitButton pointer" onClick="subOrUnsubToTrainingsplit(${resp.trainingsplit_id}, ${resp.user_id}, '${resp.trainingsplit_name}');">Abonnerer</button>`;
            if (!navigator.onLine) {
                subscribeHTML = `<button disabled class="trainingsplitButton">Abonnerer</button>`;
            }
        }

        let copyHTML = `<button class="trainingsplitButton pointer" onClick="copyTrainingsplit(${resp.trainingsplit_id}, ${resp.user_id});">Kopier</button>`;
        if (!navigator.onLine) {
            copyHTML = `<button disabled class="trainingsplitButton">Kopier</button>`;
        }

        creatorTxt = `Av: ${resp.owner}<br>`;
        const trainingsplitToolBar = document.getElementById("trainingsplitToolBar");
        trainingsplitToolBar.innerHTML += `${copyHTML}${subscribeHTML}`;
    }

    document.getElementById("smallTitle").innerHTML += `<br><h3>${resp.trainingsplit_name}</h3>${creatorTxt}${daysList}<br>${selectedDay.short || 'I dag er det fri fra trening :)'}`;

    let animation = "fadeInUp animate";
    if (showTrainingsplitAnimations === false) {
        animation = "";
    }

    if (selectedDay.list.length > 0) {

        const trainingsplitInfo = document.getElementById("trainingsplitInfo");
        const arr = selectedDay.list;

        for (let i = 0; i < arr.length; i++) {

            const exerciseInfo = arr[i];
            const exerciseName = Object.keys(arr[i])[0];
            const exerciseList = exerciseInfo[exerciseName];

            const trainingsplitTable = document.getElementById("trainingsplitTable");

            if (exerciseList.length > 0) {

                for (let j = 0; j < exerciseList.length; j++) {
                    const info = exerciseList[j];

                    if (j === 0) {
                        trainingsplitTable.innerHTML += `<br><h3 class="${animation}">${exerciseName}</h3><hr class="trainingsplitLine ${animation}">`;
                    }

                    const list = {
                        0: "Ingen",
                        1: "kg",
                        2: "%",
                        3: "RPE"
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

                    if (type === list[0]) {
                        extraHTML = "";
                    }

                    if (type === list[2]) {
                        let highestKG = 0;
                        //calc % out of 1RM if exists.

                        const exercise = exerciseName.toLowerCase();
                        const cachedLiftsList = JSON.parse(localStorage.getItem("cachedLifts_owner"));

                        if (cachedLiftsList) {
                            const cachedLiftsListKeys = Object.keys(cachedLiftsList);
                            if (cachedLiftsListKeys.includes(exercise)) {
                                const exerciseList = cachedLiftsList[exercise];
                                if (exerciseList) {
                                    if (exerciseList.length > 0) {
                                        for (let z = 0; z < exerciseList.length; z++) {
                                            const current = exerciseList[z];

                                            if (current.reps === "1") {
                                                if (parseFloat(current.kg) > highestKG) {
                                                    highestKG = parseFloat(current.kg);
                                                }
                                            }
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
                                } else {
                                    if (!ORMLifts.includes(exercise)) {
                                        ORMLifts.push(exercise);
                                    }
                                }
                            }
                        }
                    }

                    if (ORMLifts.length > 0) {
                        trainingsplitInfo.innerHTML = `Denne planen fungrerer best hvis du har 1 Rep / ORM i følgende løft: ${ORMLifts}`;
                    }

                    trainingsplitTable.innerHTML += `
                        <div class="${animation} delaySmall">
                        <p class="trainingsplitListRow trainingsplitInline">
                        ${j + 1}.
                        <p class="trainingsplitInline" style="margin-left:30px;">${info.sets}</p>
                        x
                        <p class="trainingsplitInline">${info.reps}</p>
                        ${extraHTML}
                        </p>
                        </div>
                        <hr class="trainingsplitSmallLine ${animation} delayMedium">`;
                }
            }
        }
    }

    const GuserGrid = document.getElementById("GuserGrid");

    if (GuserGrid.scrollHeight > (GuserGrid.clientHeight + 600)) {
        const backToTopBtn = `<button class="trainingsplitButton pointer" onClick="document.getElementById('GuserGrid').scrollTop = 0;">Tilbake til toppen</button>`;
        document.getElementById("trainingsplitBottom").innerHTML = backToTopBtn;
    }

    if (sessionStorage.getItem("usergrid_scroll_y_view")) {
        GuserGrid.scrollTop = sessionStorage.getItem("usergrid_scroll_y_view");
    }

    GuserGrid.addEventListener("scroll", function () {
        const scrollY = GuserGrid.scrollTop;
        sessionStorage.setItem("usergrid_scroll_y_view", scrollY);
    });
}

function viewTrainingsplitOwnerList() {

    const trainingsplit_id = document.getElementById("listworkoutPlans");

    if (trainingsplit_id) {
        viewTrainingsplit(trainingsplit_id.value);
    }
}

function viewTrainingsplitSubList() {

    const trainingsplit_id = document.getElementById("listsubworkoutPlans");

    if (trainingsplit_id) {
        viewTrainingsplit(trainingsplit_id.value);
    }
}

function viewTrainingsplit(aId, aDay) {

    if (aId && aId !== "null") {

        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayNum = new Date().getDay();
        let day = days[dayNum];

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
}

async function changeTrainingsplitDay() {

    const trainingsplitSelectDay = document.getElementById("trainingsplitSelectDay");

    if (trainingsplitSelectDay) {

        const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));

        if (trainingsplit.edit === true) {
            await saveTrainingsplit();
        }

        trainingsplit.day = trainingsplitSelectDay.value;

        sessionStorage.setItem("trainingsplit", JSON.stringify(trainingsplit));

        location.reload();
    }
}

async function addExercise() {

    const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));

    if (trainingsplit) {

        const selectNewExercise = document.getElementById("selectNewExercise").value;
        const inputNewExercise = document.getElementById("inputNewExercise").value;

        let exercise = null;

        if (selectNewExercise) {
            exercise = selectNewExercise;
        }

        if (inputNewExercise) {
            exercise = inputNewExercise;
        }

        if (exercise && exercise !== "null" && exercise !== "undefined") {

            await saveTrainingsplit();

            const body = { "authToken": token, "userInfo": user, "trainingsplit_id": trainingsplit.id, "exercise": exercise, "day": trainingsplit.day };
            const url = `/user/add/trainingsplit/exercise`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": token,
                    "userinfo": user,
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data === true) {
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    }
}

async function deleteExercise(aExercise) {

    const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));

    if (trainingsplit) {

        const exercise = aExercise;

        if (exercise) {

            const confirmDelete = confirm(`Er du sikker på at du vil slette ${exercise}?`);

            if (confirmDelete === true) {

                await saveTrainingsplit();

                const body = { "authToken": token, "userInfo": user, "trainingsplit_id": trainingsplit.id, "exercise": exercise, "day": trainingsplit.day };
                const url = `/user/delete/trainingsplit/exercise`;

                const config = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "authtoken": token,
                        "userinfo": user,
                    },
                    body: JSON.stringify(body)
                }

                const resp = await fetch(url, config);
                const data = await resp.json();

                if (data === true) {
                    location.reload();
                } else {
                    alert(data.msg);
                }
            }
        }
    }
}

async function deleteRowExercise(aExercise, aIndex) {

    const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));

    if (trainingsplit) {

        const exercise = aExercise;
        const index = aIndex;

        if (exercise) {

            const confirmDelete = confirm(`Er du sikker på at du vil slette rad nr ${index + 1} fra ${exercise}?`);

            if (confirmDelete === true) {

                await saveTrainingsplit();

                const body = { "authToken": token, "userInfo": user, "trainingsplit_id": trainingsplit.id, "exercise": exercise, "index": index, "day": trainingsplit.day };
                const url = `/user/delete/trainingsplit/exercise/row`;

                const config = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "authtoken": token,
                        "userinfo": user,
                    },
                    body: JSON.stringify(body)
                }

                const resp = await fetch(url, config);
                const data = await resp.json();

                if (data === true) {
                    location.reload();
                } else {
                    alert(data.msg);
                }
            }
        }
    }

}

async function addRowExercise(aExercise) {

    const trainingsplit = JSON.parse(sessionStorage.getItem("trainingsplit"));

    if (trainingsplit) {

        const exercise = aExercise;

        if (exercise) {

            await saveTrainingsplit();

            const body = { "authToken": token, "userInfo": user, "trainingsplit_id": trainingsplit.id, "exercise": exercise, "day": trainingsplit.day };
            const url = `/user/add/trainingsplit/exercise/row`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": token,
                    "userinfo": user,
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data === true) {
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    }
}

async function copyTrainingsplit(aTrainingsplit_id, aOwner_id) {

    const trainingsplit_id = aTrainingsplit_id;

    if (trainingsplit_id) {

        const owner_id = aOwner_id;

        if (owner_id) {

            const body = { "authToken": token, "userInfo": user, "trainingsplit_id": trainingsplit_id, "owner_id": owner_id };
            const url = `/user/copy/trainingsplit`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": token,
                    "userinfo": user,
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data.status === true) {
                const loadNewTrainingsplit = confirm("Planen er nå kopiert. Ønsker du å laste den inn i redigeringsmodus?");
                if (loadNewTrainingsplit === true) {
                    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
                    const dayNum = new Date().getDay();
                    const day = days[dayNum];
                    sessionStorage.setItem("trainingsplit", JSON.stringify({ "id": data.newtrainingsplit_id, "edit": true, "day": day }));
                    setTimeout(() => {
                        redirectToAccount();
                    }, 1000);
                }
            } else {
                alert(data.msg);
            }
        }
    }
}


async function subOrUnsubToTrainingsplit(aTrainingsplit_id, aOwner_id, aTrainingsplit_name) {

    const trainingsplit_id = aTrainingsplit_id;

    if (trainingsplit_id) {

        const owner_id = aOwner_id;

        if (owner_id) {

            const body = { "authToken": token, "userInfo": user, "trainingsplit_id": trainingsplit_id, "owner_id": owner_id };
            const url = `/user/subunsub/trainingsplit`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": token,
                    "userinfo": user,
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data.status === true) {
                const cachedSubscribedTrainingsplits_owner = JSON.parse(sessionStorage.getItem("cachedSubscribedTrainingsplits_owner"));
                if (cachedSubscribedTrainingsplits_owner) {
                    const cachedSubscribedTrainingsplits_ownerKeys = Object.keys(cachedSubscribedTrainingsplits_owner);
                    const tIDString = trainingsplit_id.toString();
                    if (!cachedSubscribedTrainingsplits_ownerKeys.includes(tIDString) && !data.msg.includes("ikke lenger")) {
                        cachedSubscribedTrainingsplits_owner[tIDString] = aTrainingsplit_name;
                    } else {
                        for (let i = 0; i < cachedSubscribedTrainingsplits_ownerKeys.length; i++) {
                            if (cachedSubscribedTrainingsplits_ownerKeys[i] === tIDString) {
                                delete cachedSubscribedTrainingsplits_owner[cachedSubscribedTrainingsplits_ownerKeys[i]];
                            }
                        }
                    }
                    sessionStorage.setItem("cachedSubscribedTrainingsplits_owner", JSON.stringify(cachedSubscribedTrainingsplits_owner));
                }
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    }

}