"use strict";
let showTrainingsplitAnimations = true,
    trainingsplit = null;

const queryStringT = window.location.search,
    urlParamsT = new URLSearchParams(queryStringT);

// checkIfValidParams
function checkIfValidParams() {

    let validParams = false;

    try {

        const id = parseInt(urlParamsT.get("trainingsplit_id"));
        let edit = urlParamsT.get("edit");
        let day = urlParamsT.get("day");

        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        if (!isNaN(id)) {
            if (edit !== "true" && edit !== "false") {
                edit = "false";
            }
            if (!days.includes(day)) {
                day = days[1];
            }

            trainingsplit = { "id": id, "edit": edit, "day": day };
            validParams = true;
        }

    } catch (err) {
        console.log(err);
        validParams = false;
    }

    return validParams;
}
// End of checkIfValidParams function


// requestTrainingsplitDetails
async function requestTrainingsplitDetails() {

    try {

        if (trainingsplit.id) {

            document.title = `Treningsplan`;

            let resp = null;
            let errorMsg = "Kunne ikke hente planen!";

            if (trainingsplit.edit !== "true") {
                const cachedActiveTrainingsplit_owner = JSON.parse(localStorage.getItem("cachedActiveTrainingsplit_owner")) || JSON.parse(sessionStorage.getItem("cachedActiveTrainingsplit_owner"));
                if (cachedActiveTrainingsplit_owner) {
                    if (cachedActiveTrainingsplit_owner.trainingsplit_id === parseInt(trainingsplit.id)) {
                        showTrainingsplitAnimations = false;
                        resp = cachedActiveTrainingsplit_owner;
                    }
                }
            }

            if (navigator.onLine && resp === null) {

                const body = { "trainingsplit_id": trainingsplit.id };
                const url = `/user/get/trainingsplit`;

                const config = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "authtoken": user.getToken(),
                        "userinfo": JSON.stringify(user.getUser())
                    },
                    body: JSON.stringify(body)
                }

                const response = await fetch(url, config);
                resp = await response.json();
                if (response.status !== 200) {
                    errorMsg = resp;
                    resp = null;
                }
            }

            if (resp) {

                document.title = `Treningsplan (${resp.trainingsplit_name})`;

                if (resp.canEdit === true && trainingsplit.edit === "true") {
                    loadEditTrainingsplit(resp, trainingsplit.day);
                } else {
                    loadViewTrainingsplit(resp, trainingsplit.day);
                }

            } else {
                showAlert(errorMsg, true, "returnToPrevious();");
            }
        } else {
            returnToPrevious();
        }


    } catch (err) {
        console.log(err);
        returnToPrevious();
    }
}
// End of requestTrainingsplitDetails function

const exerciseListCount = [];
// loadEditTrainingsplit
function loadEditTrainingsplit(aResp, aSelectedDay) {

    const resp = aResp;

    const selectedDay = resp[aSelectedDay];
    const maxTrainingsplitsExerciseRows = resp.maxTrainingsplitsExerciseRows;
    const maxTrainingsplitsExercisesPerDay = resp.maxTrainingsplitsExercisesPerDay;

    const top = `<br><input id="trainingsplitNameInp" class="trainingsplitNameInput" maxlength="20" value="${resp.trainingsplit_name}"></input>`;

    const EDays = {
        "monday": "Mandag",
        "tuesday": "Tirsdag",
        "wednesday": "Onsdag",
        "thursday": "Torsdag",
        "friday": "Fredag",
        "saturday": "Lørdag",
        "sunday": "Søndag"
    }

    let exerciseListHTML = "";
    try {
        const allowedLifts = JSON.parse(localStorage.getItem("allowedLifts")) || JSON.parse(sessionStorage.getItem("allowedLifts"));
        if (allowedLifts) {
            let exerciseListOptionsHTML = "";
            for (let v = 0; v < allowedLifts.length; v++) {
                const exercise = capitalizeFirstLetter(allowedLifts[v]);
                exerciseListOptionsHTML += `<option value="${exercise}">${exercise}</option>`;
            }
            exerciseListHTML = `
            <select id="selectNewExercise" class="trainingsplitSelect pointer">
            <option value=null>Velg øvelse her</option>
            ${exerciseListOptionsHTML}
            </select>
            eller fyll inn`;
        }
    } catch {

    }

    document.getElementById("title").innerHTML = "Redigerer:";

    document.getElementById("info").innerHTML += top;

    let optionsHTML = "";

    const EDaysKeys = Object.keys(EDays);
    for (let i = 0; i < EDaysKeys.length; i++) {

        if (EDaysKeys[i] === aSelectedDay) {
            optionsHTML += `<option selected value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
        } else {
            optionsHTML += `<option value="${EDaysKeys[i]}">${EDays[EDaysKeys[i]]}</option>`;
        }
    }

    const copy_trainingsplit = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
        `;

    let copyHTML = `<button class="trainingsplitButton pointer" onClick="copyTrainingsplitConfirm(${resp.trainingsplit_id}, ${resp.user_id});">${copy_trainingsplit}</button>`;

    const publicVisibility = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" class="bi bi-eye" viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>`;

    const privateVisibility = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" class="bi bi-eye-slash" viewBox="0 0 16 16">
    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>`;

    let visibilityHTML = `<button id="changeTrainingsplitVisibilityBtn" class="trainingsplitButton pointer" onClick="changeTrainingsplitVisibilityConfirm(${resp.trainingsplit_id}, true);">${privateVisibility}</button>`;

    if (resp.public === true) {
        visibilityHTML = `<button id="changeTrainingsplitVisibilityBtn" class="trainingsplitButton pointer" onClick="changeTrainingsplitVisibilityConfirm(${resp.trainingsplit_id}, false);">${publicVisibility}</button>`;
    }

    document.getElementById("info").innerHTML += `
    <br>
    <button id="saveTrainingsplitBtn" class="trainingsplitButton pointer fadeIn animate" onClick="saveTrainingsplit();">Lagre</button>
    ${copyHTML}
    ${visibilityHTML}
    <button class="trainingsplitButton pointer fadeIn animate" onClick="deleteTrainingsplitConfirm('${resp.trainingsplit_id}');"><img src="images/trash.svg"></img></button>`;

    const toolBarHTML = `
    <select id="trainingsplitSelectDay" onChange="changeTrainingsplitDay();" class="trainingsplitSelect pointer">${optionsHTML}</select>
    <div id="addNewExerciseDiv">
    ${exerciseListHTML}
    <input id="inputNewExercise" class="trainingsplitNameInput" maxlength="30" placeholder="Øvelse"></input>

    <button class="trainingsplitButton pointer" onClick="addExercise();">Legg til øvelse</button>
    </div>
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

    document.getElementById("trainingsplitInfo").innerHTML = `
    <p><h4>Info:</h4>
    ${shortTxt}Format: 3 x 2 = 3 Reps, 2 Sets. Reps kan feks være 3, Teknisk max, 60 sek osv
    <br>80 % = 80 % av 1 Rep/ORM i øvelsen (krever ORM i løftet for automatisk utregning)
    <br>Du kan ha ${maxTrainingsplitsExercisesPerDay} øvelser per dag.
    <br>Du kan ha ${maxTrainingsplitsExerciseRows} rader per øvelse.
    </p>`;

    if (selectedDay.list) {

        const arr = selectedDay.list;

        if (arr.length >= maxTrainingsplitsExercisesPerDay) {
            document.getElementById("addNewExerciseDiv").innerHTML = "";
        }

        for (let i = 0; i < arr.length; i++) {

            const exerciseInfo = arr[i];
            const exerciseName = Object.keys(arr[i])[0];
            const exerciseList = exerciseInfo[exerciseName];

            const trainingsplitTable = document.getElementById("trainingsplitTable");

            const arrow_up_trainingsplit = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
            </svg>
            `;

            const arrow_down_trainingsplit = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-arrow-down-square" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z" />
            </svg>
            `;

            let upBtnHTML = `<button class="trainingsplitButton pointer fadeIn animate" onClick="moveExerciseOrder(${i}, true);">${arrow_up_trainingsplit}</button>`;
            let downBtnHTML = `<button class="trainingsplitButton pointer fadeIn animate" onClick="moveExerciseOrder(${i}, false);">${arrow_down_trainingsplit}</button>`;

            if (i === 0) {
                upBtnHTML = "";
            }

            if (i === (arr.length - 1)) {
                downBtnHTML = "";
            }

            trainingsplitTable.innerHTML += `
            <br><input id="${exerciseName}-trainingsplit_name" style="font-size:18.75px;font-weight:bolder;" class="trainingsplitNameInput fadeInUp animate" value="${exerciseName}" maxlength="30" placeholder="Øvelse">
            ${upBtnHTML}
            ${downBtnHTML}
            <button class="trainingsplitButton pointer fadeIn animate" onClick="deleteExerciseConfirm('${exerciseName}');"><img src="images/trash.svg"></button>
            </input>
            <hr class="trainingsplitLine fadeInUp animate">`;

            exerciseListCount.push({ [exerciseName]: exerciseList.length });

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
           
            Reps
            <input id="${exerciseName}-${j}-reps" class="trainingsplitRepsInput" maxlength="15" value="${info.reps}"></input>

            x

            Sets
            <input id="${exerciseName}-${j}-sets" class="trainingsplitSetsInput" maxlength="2" value="${info.sets}"></input>

            Tall
            <input id="${exerciseName}-${j}-number" class="trainingsplitInput" maxlength="6" value="${info.number}"></input>
            <select id="${exerciseName}-${j}-value" class="trainingsplitSelect pointer">
            ${optionsHTMLList}
            </select>
    
            <button class="trainingsplitButton pointer" onClick="deleteRowExerciseConfirm('${exerciseName}', ${j});"><img src="images/trash.svg"></button>
            </p>
            <hr class="trainingsplitSmallLine fadeInUp animate delayMedium">`;
            }

            if (exerciseList.length < maxTrainingsplitsExerciseRows) {
                trainingsplitTable.innerHTML += `<p><button class="trainingsplitButton pointer" onClick="addRowExercise('${exerciseName}');">Ny rad</button></p>`;
            }
        }
    }

    const GuserGrid = document.getElementById("GuserGrid");

    if (GuserGrid.scrollHeight > (GuserGrid.clientHeight + 100)) {
        const backToTopBtn = `<button style="margin-bottom:20px;" class="trainingsplitButton pointer" onClick="document.getElementById('GuserGrid').scrollTop = 0;">Tilbake til toppen</button>`;
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
// End of loadEditTrainingsplit function

// loadViewTrainingsplit
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

    const daysList = `<br><select id="trainingsplitSelectDay" onChange="changeTrainingsplitDay();" class="trainingsplitSelect pointer">${optionsHTML}</select>`;

    document.getElementById("userGrid").innerHTML = `
    <div id="trainingsplitDiv">
    <p id="trainingsplitTable"></p>
    <br><br>
    <p id="trainingsplitBottom"></p>
    </div>`;

    document.getElementById("title").innerHTML = resp.trainingsplit_name;

    document.getElementById("info").innerHTML += `${daysList}<br>${selectedDay.short || 'I dag er det fri fra trening :)'}`;

    if (user && user.getId() !== resp.user_id) {

        const subscribedtrainingsplits = user.getSetting("subscribedtrainingsplits");

        let isSubscribed = false;

        if (subscribedtrainingsplits) {
            if (Object.keys(subscribedtrainingsplits).includes(resp.trainingsplit_id.toString())) {
                isSubscribed = true;
            }
        }

        const subscribe_trainingsplit = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-bookmark" viewBox="0 0 16 16">
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
        </svg>
        `;

        const subscribed_trainingsplit = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
            <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
        `;

        let subscribeHTML = `<button class="trainingsplitButton pointer" onClick="subOrUnsubToTrainingsplit(${resp.trainingsplit_id}, ${resp.user_id}, '${resp.trainingsplit_name}');">${subscribe_trainingsplit}</button>`;

        if (!navigator.onLine) {
            subscribeHTML = `<button disabled class="trainingsplitButton">${subscribe_trainingsplit}</button>`;
        }

        if (isSubscribed === true) {
            subscribeHTML = `<button class="trainingsplitButton pointer" onClick="subOrUnsubToTrainingsplitConfirm(${resp.trainingsplit_id}, ${resp.user_id}, '${resp.trainingsplit_name}');">${subscribed_trainingsplit}</button>`;
            if (!navigator.onLine) {
                subscribeHTML = `<button disabled class="trainingsplitButton">${subscribed_trainingsplit}</button>`;
            }
        }

        const copy_trainingsplit = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
        `;

        let copyHTML = `<button class="trainingsplitButton pointer" onClick="copyTrainingsplitConfirm(${resp.trainingsplit_id}, ${resp.user_id});">${copy_trainingsplit}</button>`;
        if (!navigator.onLine || resp.public === false) {
            copyHTML = `<button disabled class="trainingsplitButton">${copy_trainingsplit}</button>`;
        }

        document.getElementById("createdBy").innerHTML = `
        Av: <div style="display:inline-block;font-weight:bold;">
        <div class="pointer" onclick="redirectToUser('${resp.user_id}');">${resp.owner}</div>
        </div>`;

        document.getElementById("info").innerHTML += `<br><br>${copyHTML}${subscribeHTML}`;
    }

    getSubscriberCount();
    // displays subscriber count on trainingsplit if it has more than 0 subscribers
    async function getSubscriberCount() {
        const subscriberCountDom = document.getElementById("subscriberCount");
        let cachedSubCounts = null;

        try {
            cachedSubCounts = JSON.parse(sessionStorage.getItem("cachedSubCounts"));
            if (cachedSubCounts) {
                let subCount = cachedSubCounts[resp.trainingsplit_id];
                if (subCount) {
                    if (!isNaN(subCount) && subCount > 0) {
                        subscriberCountDom.innerHTML = `Abonnenter: ${subCount}`;
                    }
                }
            }
        } catch { }

        if (navigator.onLine) {

            const subCountBody = { "trainingsplit_id": resp.trainingsplit_id };
            const subCountUrl = `/user/get/trainingsplit/subscriberCount`;

            const subCountConfig = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser())
                },
                body: JSON.stringify(subCountBody)
            }

            const subCountResponse = await fetch(subCountUrl, subCountConfig);
            if (subCountResponse.status === 200) {
                const subCountData = await subCountResponse.json();
                const subscriberCount = parseInt(subCountData);
                if (!isNaN(subscriberCount)) {
                    try {
                        cachedSubCounts = JSON.parse(sessionStorage.getItem("cachedSubCounts"));
                        if (cachedSubCounts) {
                            cachedSubCounts[resp.trainingsplit_id] = subscriberCount;
                        } else {
                            cachedSubCounts = {
                                [resp.trainingsplit_id]: subscriberCount
                            }
                        }
                        sessionStorage.setItem("cachedSubCounts", JSON.stringify(cachedSubCounts));
                    } catch { }
                    if (subscriberCount > 0) {
                        subscriberCountDom.innerHTML = `Abonnenter: ${subscriberCount}`;
                        return;
                    }
                }
            }
            subscriberCountDom.innerHTML = "";
        }
    }
    // End of getSubscriberCount function

    if (resp.public === false) {
        const visibilityStatusDom = document.getElementById("visibilityStatus");
        if (resp.user_id === user.getId()) {
            visibilityStatusDom.innerHTML = "Treningsplanen er bare synlig for deg og abonnenter";
        } else {
            visibilityStatusDom.innerHTML = "Treningsplanen er bare synlig for eieren og abonnenter";
        }
    }

    let animation = "fadeInUp animate";
    if (showTrainingsplitAnimations === false) {
        animation = "";
    }

    if (selectedDay.list.length > 0) {

        const arr = selectedDay.list;

        //const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        //const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

        for (let i = 0; i < arr.length; i++) {

            const exerciseInfo = arr[i];
            const exerciseName = Object.keys(arr[i])[0];
            const exerciseList = exerciseInfo[exerciseName];

            const trainingsplitTable = document.getElementById("trainingsplitTable");

            trainingsplitTable.innerHTML += `<br><h3 class="${animation}">${exerciseName}</h3>`;

            if (exerciseList.length > 0) {
                trainingsplitTable.innerHTML += `<hr class="trainingsplitLine ${animation}">`;

                for (let j = 0; j < exerciseList.length; j++) {
                    const info = exerciseList[j];

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
                                    const checkExercise = capitalizeFirstLetter(exercise);
                                    if (!ORMLifts.includes(checkExercise)) {
                                        ORMLifts.push(checkExercise);
                                    }
                                }
                            }
                        }
                    }

                    trainingsplitTable.innerHTML += `
                        <div class="${animation} delaySmall">
                        <p class="trainingsplitListRow trainingsplitInline">
                        ${j + 1}.
                        <p class="trainingsplitInline" style="margin-left:30px;">${info.reps}</p>
                        x
                        <p class="trainingsplitInline">${info.sets}</p>
                        ${extraHTML}
                        </p>
                        </div>
                        <hr class="trainingsplitSmallLine ${animation} delayMedium">`;

                }
            }
        }
    }

    if (ORMLifts.length > 0) {
        document.getElementById("info").innerHTML += `<br><br>Denne planen fungrerer best hvis du har 1 Rep / ORM i følgende løft: ${ORMLifts}`;
    }

    const GuserGrid = document.getElementById("GuserGrid");

    if (GuserGrid.scrollHeight > (GuserGrid.clientHeight + 100)) {
        const backToTopBtn = `<button style="margin-bottom:20px;" class="trainingsplitButton pointer" onClick="document.getElementById('GuserGrid').scrollTop = 0;">Tilbake til toppen</button>`;
        document.getElementById("trainingsplitBottom").innerHTML = backToTopBtn;
    }
}
// End of loadViewTrainingsplit function

// viewTrainingsplitOwnerList
function viewTrainingsplitOwnerList() {

    const trainingsplit_id = document.getElementById("listworkoutPlans");
    if (trainingsplit_id) {
        if (trainingsplit_id.value !== "" && trainingsplit_id.value !== "null") {
            redirectToTrainingsplit(trainingsplit_id.value);
        } else {
            document.getElementById("respworkoutPlans").textContent = `Vennligst velg en treningsplan fra "Dine planer" listen!`;
        }
    }
}
// End of viewTrainingsplitOwnerList function

// viewTrainingsplitSubList
function viewTrainingsplitSubList() {

    const trainingsplit_id = document.getElementById("listsubworkoutPlans");

    if (trainingsplit_id) {
        if (trainingsplit_id.value !== "" && trainingsplit_id.value !== "null") {
            redirectToTrainingsplit(trainingsplit_id.value);
        } else {
            document.getElementById("respworkoutPlans").textContent = `Vennligst velg en treningsplan fra "Abonnerte planer" listen!`;
        }
    }
}
// End of viewTrainingsplitSubList function

// viewTrainingsplit
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

        window.location.href = `/trainingsplit.html?trainingsplit_id=${aId}&edit=false&day=${day}`;
    }
}
// End of viewTrainingsplit function

// changeTrainingsplitDay
async function changeTrainingsplitDay() {

    const trainingsplitSelectDay = document.getElementById("trainingsplitSelectDay");

    if (trainingsplitSelectDay) {

        if (trainingsplit.edit === "true") {
            await saveTrainingsplit(false);
        }

        trainingsplit.day = trainingsplitSelectDay.value;
        urlParamsT.set("day", trainingsplitSelectDay.value);

        window.location.search = urlParamsT.toString();
    }
}
// End of changeTrainingsplitDay function

// addExercise
async function addExercise() {

    if (trainingsplit && user) {

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

            await saveTrainingsplit(false);

            const body = { "trainingsplit_id": trainingsplit.id, "exercise": exercise, "day": trainingsplit.day };
            const url = `/user/add/trainingsplit/exercise`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser()),
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data === true) {
                location.reload();
            } else {
                showAlert(data.msg, true);
            }
        }
    }
}
// End of addExercise function

// deleteExerciseConfirm
async function deleteExerciseConfirm(aExercise) {

    if (trainingsplit && user) {

        const exercise = aExercise;

        if (exercise) {

            let exerciseName = `${exercise}`;

            const domName = document.getElementById(`${exercise}-trainingsplit_name`);

            if (domName) {
                exerciseName = domName.value;
            }
            showConfirm(`Er du sikker på at du vil slette øvelsen ${exerciseName}? Dette kan ikke angres!`, `deleteExercise('${exercise}');`);
        }
    }
}
// End of deleteExerciseConfirm function

// deleteExercise
async function deleteExercise(aExercise) {

    if (trainingsplit && user) {

        const exercise = aExercise;

        if (exercise) {

            let exerciseName = `${exercise}`;

            const domName = document.getElementById(`${exercise}-trainingsplit_name`);

            if (domName) {
                exerciseName = domName.value;
            }

            await saveTrainingsplit(false);

            const body = { "trainingsplit_id": trainingsplit.id, "exercise": exercise, "day": trainingsplit.day };
            const url = `/user/delete/trainingsplit/exercise`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser()),
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data === true) {
                location.reload();
            } else {
                showAlert(data.msg, true);
            }
        }
    }
}
// End of deleteExercise function

// deleteRowExerciseConfirm
async function deleteRowExerciseConfirm(aExercise, aIndex) {

    if (trainingsplit && user) {

        const exercise = aExercise;
        const index = aIndex;

        if (exercise) {
            showConfirm(`Er du sikker på at du vil slette rad nr ${index + 1} fra øvelsen ${exercise}? Dette kan ikke angres!`, `deleteRowExercise('${exercise}', '${index}');`);
        }
    }
}
// End of deleteRowExerciseConfirm function

// deleteRowExercise
async function deleteRowExercise(aExercise, aIndex) {

    if (trainingsplit && user) {

        const exercise = aExercise;
        const index = aIndex;

        if (exercise) {

            await saveTrainingsplit(false);

            const body = { "trainingsplit_id": trainingsplit.id, "exercise": exercise, "index": index, "day": trainingsplit.day };
            const url = `/user/delete/trainingsplit/exercise/row`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser()),
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data === true) {
                location.reload();
            } else {
                showAlert(data.msg, true);
            }
        }
    }
}
// End of deleteRowExercise function

// addRowExercise
async function addRowExercise(aExercise) {

    if (trainingsplit && user) {

        const exercise = aExercise;

        if (exercise) {

            await saveTrainingsplit(false);

            const body = { "trainingsplit_id": trainingsplit.id, "exercise": exercise, "day": trainingsplit.day };
            const url = `/user/add/trainingsplit/exercise/row`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser()),
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data === true) {
                location.reload();
            } else {
                showAlert(data.msg, true);
            }
        }
    }
}
// End of addRowExercise function

// moveExerciseOrder
async function moveExerciseOrder(aIndex, aMoveUp) {

    if (trainingsplit && user) {

        const index = aIndex;
        const moveUp = aMoveUp;

        if (index >= 0) {

            await saveTrainingsplit(false);

            const body = { "trainingsplit_id": trainingsplit.id, "day": trainingsplit.day, "index": index, "moveUp": moveUp };
            const url = `/user/update/trainingsplit/exercise/move`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser()),
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data === true) {
                location.reload();
            } else {
                showAlert(data.msg, true);
            }
        }
    }
}
// End of moveExerciseOrder function

// copyTrainingsplitConfirm
async function copyTrainingsplitConfirm(aTrainingsplit_id, aOwner_id) {

    const trainingsplit_id = aTrainingsplit_id;

    if (trainingsplit_id && user) {

        const owner_id = aOwner_id;

        if (owner_id) {
            showConfirm(`Vil du ta en kopi av treningsplanen?`, `copyTrainingsplit('${trainingsplit_id}', '${owner_id}');`);
        }
    }
}
// End of copyTrainingsplitConfirm function

// copyTrainingsplit
async function copyTrainingsplit(aTrainingsplit_id, aOwner_id) {

    const trainingsplit_id = aTrainingsplit_id;

    if (trainingsplit_id && user) {

        const owner_id = aOwner_id;

        if (owner_id) {

            const body = { "trainingsplit_id": trainingsplit_id, "owner_id": owner_id };
            const url = `/user/copy/trainingsplit`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser()),
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data.status === true) {
                showConfirm("Planen er nå kopiert. Ønsker du å laste den inn i redigeringsmodus?", `loadIntoEditTrainingsplit('${data.newtrainingsplit_id}');`);
            } else {
                showAlert(data.msg, true);
            }
        }
    }
}
// End of copyTrainingsplit function

// changeTrainingsplitVisibilityConfirm
async function changeTrainingsplitVisibilityConfirm(aTrainingsplit_id, aValue) {

    const trainingsplit_id = aTrainingsplit_id;
    const value = aValue;

    if (trainingsplit_id && user) {

        let visibilityTxt = "privat? Bare nåværende abonnenter og deg vil kunne ha tilgang til planen.";

        if (value === true) {
            visibilityTxt = "offentlig?";
        }
        showConfirm(`Vil du gjøre treningsplanen ${visibilityTxt}`, `changeTrainingsplitVisibility('${trainingsplit_id}', ${value});`);
    }
}
// End of changeTrainingsplitVisibilityConfirm function

// changeTrainingsplitVisibility
async function changeTrainingsplitVisibility(aTrainingsplit_id, aValue) {

    const trainingsplit_id = aTrainingsplit_id;
    const value = aValue;

    if (trainingsplit_id && user) {

        const body = { "trainingsplit_id": trainingsplit_id, "value": value };
        const url = `/user/change/trainingsplit/visibility`;

        const config = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authtoken": user.getToken(),
                "userinfo": JSON.stringify(user.getUser()),
            },
            body: JSON.stringify(body)
        }

        const resp = await fetch(url, config);
        const data = await resp.json();

        if (data === true) {
            const changeTrainingsplitVisibilityBtn = document.getElementById("changeTrainingsplitVisibilityBtn");

            const publicVisibility = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" class="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>`;

            const privateVisibility = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" class="bi bi-eye-slash" viewBox="0 0 16 16">
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
            </svg>`;

            if (value === true) {
                changeTrainingsplitVisibilityBtn.setAttribute("onclick", `changeTrainingsplitVisibilityConfirm(${trainingsplit_id}, false);`)
                changeTrainingsplitVisibilityBtn.innerHTML = publicVisibility;
            } else {
                changeTrainingsplitVisibilityBtn.setAttribute("onclick", `changeTrainingsplitVisibilityConfirm(${trainingsplit_id}, true);`)
                changeTrainingsplitVisibilityBtn.innerHTML = privateVisibility;
            }

        } else {
            showAlert(data.msg, true);
        }
    }
}
// End of changeTrainingsplitVisibility function

// loadIntoEditTrainingsplit
function loadIntoEditTrainingsplit(aNewTrainingsplit_id) {
    if (aNewTrainingsplit_id) {
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayNum = new Date().getDay();
        const day = days[dayNum];
        redirectToTrainingsplit(aNewTrainingsplit_id, day, true);
    }
}
// End of loadIntoEditTrainingsplit function

// subOrUnsubToTrainingsplitConfirm
async function subOrUnsubToTrainingsplitConfirm(aTrainingsplit_id, aOwner_id, aTrainingsplit_name) {

    const trainingsplit_id = aTrainingsplit_id;

    if (trainingsplit_id && user) {

        const owner_id = aOwner_id;

        if (owner_id) {

            const subscribedtrainingsplits = user.getSetting("subscribedtrainingsplits");
            if (subscribedtrainingsplits) {
                const subscribedtrainingsplitsKeys = Object.keys(subscribedtrainingsplits);

                const tIDString = trainingsplit_id.toString();
                if (subscribedtrainingsplitsKeys.includes(tIDString)) {
                    const trainingsplit_name = document.getElementById("title");
                    showConfirm(`
                    Vil du si opp abonnementet på ${trainingsplit_name.textContent || subscribedtrainingsplitsKeys[trainingsplit_id] || "planen"}?
                    Hvis treningsplanen er privat, så kan du ikke se planen igjen før den blir offentlig igjen.`,
                        `subOrUnsubToTrainingsplit('${trainingsplit_id}', '${owner_id}', '${aTrainingsplit_name}');`);
                } else {
                    subOrUnsubToTrainingsplit(trainingsplit_id, owner_id, aTrainingsplit_name);
                }
            }
        }
    }
}
// End of subOrUnsubToTrainingsplitConfirm function

// subOrUnsubToTrainingsplit
async function subOrUnsubToTrainingsplit(aTrainingsplit_id, aOwner_id, aTrainingsplit_name) {

    const trainingsplit_id = aTrainingsplit_id;

    if (trainingsplit_id && user) {

        const owner_id = aOwner_id;

        if (owner_id) {

            const subscribedtrainingsplits = user.getSetting("subscribedtrainingsplits");

            const body = { "trainingsplit_id": trainingsplit_id, "owner_id": owner_id };
            const url = `/user/subunsub/trainingsplit`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser()),
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            if (data.status === true) {
                if (subscribedtrainingsplits) {
                    const subscribedtrainingsplitsKeys = Object.keys(subscribedtrainingsplits);
                    const tIDString = trainingsplit_id.toString();
                    if (!subscribedtrainingsplitsKeys.includes(tIDString) && !data.msg.includes("ikke lenger")) {
                        subscribedtrainingsplits[tIDString] = aTrainingsplit_name;
                    } else {
                        for (let i = 0; i < subscribedtrainingsplitsKeys.length; i++) {
                            if (subscribedtrainingsplitsKeys[i] === tIDString) {
                                delete subscribedtrainingsplits[subscribedtrainingsplitsKeys[i]];
                            }
                        }
                    }
                    user.changeSetting("subscribedtrainingsplits", subscribedtrainingsplits);
                }
                location.reload();
            } else {
                showAlert(data.msg, true);
            }
        }
    }
}
// End of subOrUnsubToTrainingsplit function

// exitTrainingsplitConfirm
async function exitTrainingsplitConfirm() {
    showConfirm("Vil du lagre før du forlater?", "exitTrainingsplit(true);", "exitTrainingsplit();");
}
// End of exitTrainingsplitConfirm function

// exitTrainingsplit
async function exitTrainingsplit(aSave) {

    if (trainingsplit.edit === "true" && aSave === true) {
        await saveTrainingsplit(false);
    }

    const viewinguser_id = urlParamsT.get("user_id");

    const referrer = sessionStorage.getItem("trainingsplit_return_to_feed");
    if (referrer === "true") {
        sessionStorage.removeItem("trainingsplit_return_to_feed");
        redirectToFeed();
    } else if (viewinguser_id) {
        window.location.search = `?user_id=${viewinguser_id}`;
    } else {
        window.location.search = "";
    }
}
// End of exitTrainingsplit function