function loadSetting(aSetting) {

    if (sessionStorage.getItem("userSettings")) {
        settings = JSON.parse(sessionStorage.getItem("userSettings"));
    }

    const setting = aSetting || sessionStorage.getItem("currentSetting") || ELoadSettings.settings.name;
    saveNewScrollPos = false;
    titleDom.innerHTML = setting;
    document.title = setting;
    settingsGrid.innerHTML = "";

    if (setting === ELoadSettings.password.name) {
        cacheCurrentSetting(setting);
        loadPasswordPage();
    }

    else if (setting === ELoadSettings.aboutMe.name) {
        cacheCurrentSetting(setting);
        loadAboutMePage();
    }

    else if (setting === ELoadSettings.apperance.name) {
        cacheCurrentSetting(setting);
        loadAppearancePage();
    }

    else if (setting === ELoadSettings.progressionInfo.name) {
        cacheCurrentSetting(setting);
        loadProgressionInfoPage();
    }

    else if (setting === ELoadSettings.aboutApp.name) {
        cacheCurrentSetting(setting);
        loadAboutAppPage(setting);
    }

    else if (setting === ELoadSettings.pendingUsers.name) {
        cacheCurrentSetting(setting);
        loadPendingUsersPage(setting);
    }

    else if (setting === ELoadSettings.users.name) {
        cacheCurrentSetting(setting);
        loadUsersListPage(setting);
    }

    else if (setting === ELoadSettings.api.name) {
        cacheCurrentSetting(setting);
        loadAPIPage();
    }

    else if (setting === ELoadSettings.privacy.name) {
        cacheCurrentSetting(setting);
        loadPrivacyPage();
    }

    else if (setting === ELoadSettings.deleteMe.name) {
        loadDeleteMePage();
    }

    else {
        document.title = ELoadSettings.settings.name;
        cacheCurrentSetting(ELoadSettings.settings.name);
        loadDefaultPage(ELoadSettings.settings.name);
    }
}

async function loadDefaultPage(setting) {

    titleDom.innerHTML = ELoadSettings.settings.name;
    settingsGrid.innerHTML = "";

    settingsGrid.innerHTML += getTemplate("Visningsnavn", "", `<input id="displaynameInp" maxlength="20" onKeydown="return validateDisplaynameInput();" style="text-align:right;" class='settingsInput' value='${userInfo.displayname}'></input><button onClick="saveDisplayname();" style="display:none;" id="displaynameSaveBtn" class="settingsButton pointer">Lagre</button>`, "borderTop");
    settingsGrid.innerHTML += getTemplate("Brukernavn", "", `<input id="usernameInp" maxlength="20" onKeydown="return validateUsernameInput();" style="text-align:right;" class='settingsInput' value='${userInfo.username}'></input><button onClick="saveUsername();" style="display:none;" id="usernameSaveBtn" class="settingsButton pointer">Lagre</button>`);

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.password.name, "passwordDiv");

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.aboutMe.name, "aboutDiv", "spacingTop");

    if (settings.publicprofile === true) {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Offentlig profil", "profileVisibilityDiv", true, "publicprofile", "spacingTop");
    } else {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Offentlig profil", "profileVisibilityDiv", false, "publicprofile", "spacingTop");
    }

    if (settings.displayleaderboards === true) {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Ledertavler synlighet", "leaderboardsVisibilityDiv", true, "displayleaderboards");
    } else {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Ledertavler synlighet", "leaderboardsVisibilityDiv", false, "displayleaderboards");
    }

    if (settings.displayworkoutlist === true) {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Trener i dag listen synlighet", "workoutTodayListDiv", true, "displayworkoutlist");
    } else {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Trener i dag listen synlighet", "workoutTodayListDiv", false, "displayworkoutlist");
    }

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.apperance.name, "appearanceDiv", "spacingTop");
    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.progressionInfo.name, "appearanceDiv");

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.aboutApp.name, "aboutAppDiv", "spacingTop");

    if (userInfo.hasOwnProperty("isadmin")) {
        if (userInfo.isadmin === true) {
            settingsGrid.innerHTML += getPendingRequestsTemplate();
            settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.users.name, "usersDiv");
        }
    }

    if (userInfo.hasOwnProperty("apikey")) {
        settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.api.name, "apiDiv");
    }

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.privacy.name);

    settingsGrid.innerHTML += getLogoutBtn();

    scrollToSavedPos(setting);

    if (userInfo.hasOwnProperty("isadmin")) {
        if (userInfo.isadmin === true) {

            const body = { "authToken": token, "userInfo": user, "onlyNumbers": true };
            const url = `/users/list/pending`;

            const resp = await callServerAPI(body, url);

            if (resp) {
                if (resp[0].hasOwnProperty("id")) {
                    const pendingRequestsTxt = document.getElementsByName("pendingRequestsTxt");
                    pendingRequestsTxt[0].innerHTML = `${ELoadSettings.pendingUsers.name} (${resp.length})`;
                }
            }
        }
    }

    saveNewScrollPos = true;
}

function loadPasswordPage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du endre passordet ditt", "left");

    settingsGrid.innerHTML += getCenteredTextTemplate("Skriv inn eksisterende passord", "", "borderTop");
    settingsGrid.innerHTML += getCenteredTextTemplate("<input class='settingsInput' id='exsistingPsw' type='password' placeholder='Fyll inn'></input>");

    settingsGrid.innerHTML += getCenteredTextTemplate("Skriv inn ditt nye ønskede passord", "usernameDiv", "spacingTop");
    settingsGrid.innerHTML += getCenteredTextTemplate("<input class='settingsInput' id='newPsw' type='password' placeholder='Fyll inn'></input>");

    settingsGrid.innerHTML += getCenteredTextTemplate("Gjenta ditt nye ønskede passord", "usernameDiv", "spacingTop");
    settingsGrid.innerHTML += getCenteredTextTemplate("<input class='settingsInput' id='repeatNewPsw' type='password' placeholder='Fyll inn'></input>");

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="updatePassword();">Oppdater passord</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAboutMePage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du velge høyde, vekt og alder. Om profilen din er offentlig, vises dette til andre brukere", "left");

    settingsGrid.innerHTML += getTemplate("Treningssenter", "", `<input id="gymInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.gym}' maxlength="30"></input>`, "borderTop");
    settingsGrid.innerHTML += getTemplate("Alder", "", `<input id="ageInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.age}' type="number">år</input>`);

    settingsGrid.innerHTML += getTemplate("Høyde", "", `<input id="heightInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.height}' type="number">cm</input>`, "spacingTop");
    settingsGrid.innerHTML += getTemplate("Vekt", "", `<input id="weightInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.weight}' type="number">kg</input>`);

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button id="updateAboutMeBtn" class='settingsButton' onClick="updateAboutMe();">Oppdater detaljer</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="aboutMeResetValues();">Tilbakestill verdier</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAppearancePage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du endre utseende på appen!", "left");

    const theme = localStorage.getItem("theme") || sessionStorage.getItem("theme") || "0";

    const themes = {
        0: { "name": "Automatisk", "theme": "0" },
        1: { "name": "Lys", "theme": "1" },
        2: { "name": "Mørk", "theme": "2" }
    }

    const themeKeys = Object.keys(themes);

    let appearanceThemeOptionsHTML = "";

    for (let i = 0; i < themeKeys.length; i++) {

        if (theme === themes[themeKeys[i]].theme) {
            appearanceThemeOptionsHTML += `<option selected="selected" value="${themes[themeKeys[i]].theme}">${themes[themeKeys[i]].name}</option>`;
        } else {
            appearanceThemeOptionsHTML += `<option value="${themes[themeKeys[i]].theme}">${themes[themeKeys[i]].name}</option>`;
        }
    }

    const appearanceThemeHTML = `
    <select id="appearanceThemeSelection">
       ${appearanceThemeOptionsHTML}
    </select>
    `;

    settingsGrid.innerHTML += getTemplate("Tema", "appearanceThemeInp", appearanceThemeHTML, "borderTop");

    const colorThemeKeys = Object.keys(allowedThemes);
    let themeColorOptionsHTML = "";
    let colorTheme = allowedThemes[0].theme;
    const preferredTheme = localStorage.getItem("colorTheme") || sessionStorage.getItem("colorTheme") || colorTheme;
    for (let i = 0; i < colorThemeKeys.length; i++) {

        if (preferredTheme === allowedThemes[colorThemeKeys[i]].theme) {
            themeColorOptionsHTML += `<option selected="selected" value="${colorThemeKeys[i]}">${allowedThemes[colorThemeKeys[i]].name}</option>`;
        } else {
            themeColorOptionsHTML += `<option value="${colorThemeKeys[i]}">${allowedThemes[colorThemeKeys[i]].name}</option>`;
        }
    }

    const themeColorSelectionHTML = `
    <select id="themeColorSelection">
    ${themeColorOptionsHTML}
    </select>
    `;

    settingsGrid.innerHTML += getTemplate("Farge-tema", "themeColorInp", themeColorSelectionHTML);

    //settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="saveApperanceSettings();">Lagre endringer</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();

    document.getElementById("appearanceThemeSelection").addEventListener("change", function (evt) {
        savePreferredApperance();
    });

    document.getElementById("themeColorSelection").addEventListener("change", function (evt) {
        saveColorTheme();
    });
}

function loadProgressionInfoPage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du endre hvor mye informasjon du ønsker å se på startsiden!", "left");

    const badgeSizesObj = {
        0: { name: "Liten", value: 0 },
        1: { name: "Stor", value: 1 }
    }

    let badeSizeOptionsHTML = "";

    const badgeSizesObjKeys = Object.keys(badgeSizesObj);

    for (let i = 0; i < badgeSizesObjKeys.length; i++) {

        const badge = badgeSizesObj[badgeSizesObjKeys[i]];

        if (badge.value === settings.badgesize) {
            badeSizeOptionsHTML += `<option selected="selected" value="${badge.value}">${badge.name}</option>`;
        } else {
            badeSizeOptionsHTML += `<option value="${badge.value}">${badge.name}</option>`;
        }
    }

    const badeSizeHTML = `
    <select id="badgeSizeSelection">
       ${badeSizeOptionsHTML}
    </select>
    `;

    settingsGrid.innerHTML += getTemplate("Størrelse", "badgeSizeInp", badeSizeHTML, "borderTop");

    /* */

    const badgeDetailsObj = {
        0: { name: "Alt", value: 0 },
        1: { name: "KG igjen", value: 1 },
        2: { name: "% fremgang", value: 2 }
    }

    let badgeDetailsOptionsHTML = "";

    const badgeDetailsObjKeys = Object.keys(badgeDetailsObj);

    for (let i = 0; i < badgeDetailsObjKeys.length; i++) {

        const badge = badgeDetailsObj[badgeDetailsObjKeys[i]];

        if (badge.value === settings.badgedetails) {
            badgeDetailsOptionsHTML += `<option selected="selected" value="${badge.value}">${badge.name}</option>`;
        } else {
            badgeDetailsOptionsHTML += `<option value="${badge.value}">${badge.name}</option>`;
        }
    }

    const badgeDetailsHTML = `
    <select id="badgeDetailsSelection">
       ${badgeDetailsOptionsHTML}
    </select>
    `;

    settingsGrid.innerHTML += getTemplate("Informasjon", "badgeDetailsInp", badgeDetailsHTML);

    //settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="alert('saveDetails');">Lagre endringer</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();

    document.getElementById("badgeSizeSelection").addEventListener("change", function (evt) {
        updateBadgeSize();
    });

    document.getElementById("badgeDetailsSelection").addEventListener("change", function (evt) {
        updateBadgeDetails();
    });
}

function loadAboutAppPage(setting) {

    const imageURL = new Image();
    imageURL.src = application.logoURL;

    imageURL.onload = function () {

        if (sessionStorage.getItem("currentSetting") === ELoadSettings.aboutApp.name) {

            const imageHTML = `
            <img id="logo" src="${application.logoURL}" alt="" draggable="false" class="noselect settingsLogo"></img>
            `;

            settingsGrid.innerHTML = justTextTemplate(imageHTML, "center");

            //document.getElementById("logo").src = application.logoURL;

            const appInfoHTML = `
            <strong>${application.name}</strong>
            <br>
            <p class="settingsApplicationFullVersion">${application.version.full || application.version.fullNumber || ""}</p>
            `;

            settingsGrid.innerHTML += justTextTemplate(appInfoHTML, "center");

            settingsGrid.innerHTML += getLeftTextTemplate(aboutAppText, "", "spacingTop");

            if (application.updatesInfo.showOnGoing === true) {
                settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton'>${ongoingUpdatesText}</button>`, "", "spacingTop");
                settingsGrid.innerHTML += getLeftTextTemplate(ongoingUpdates);
            }

            if (application.updatesInfo.showPlanned === true) {
                settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton'>${plannedUpdatesText}</button>`, "", "spacingTop");
                settingsGrid.innerHTML += getLeftTextTemplate(plannedUpdates);
            }

            settingsGrid.innerHTML += getCenteredTextTemplate(aboutAppBottomInfo, "", "spacingTop");

            settingsGrid.innerHTML += getBottomSpacingTemplate();

            scrollToSavedPos(setting);
            saveNewScrollPos = true;

        }

    }
}

async function loadUsersListPage(setting) {

    const body = { "authToken": token, "userInfo": user };
    const url = `/users/list/all`;

    const resp = await callServerAPI(body, url);

    if (resp.hasOwnProperty("allUsers") && resp.hasOwnProperty("allAPIUsers") && sessionStorage.getItem("currentSetting") === ELoadSettings.users.name) {

        let totalUsers = 0;
        const allAPIUsersArr = [];

        for (let i = 0; i < resp.allAPIUsers.length; i++) {
            allAPIUsersArr.push(parseInt(resp.allAPIUsers[i].user_id));
        }

        let totalAPIUsers = allAPIUsersArr.length;
        if (resp.allUsers[0].hasOwnProperty("id")) {
            totalUsers = resp.allUsers.length
        }

        let usersText = `${application.name} har ${totalUsers} brukere<br>${totalAPIUsers} av brukerene har API tilgang<br>Admins kan besøke profilen uavhengig om den er privat eller ikke<br>Her er listen med brukere`;
        if (totalUsers === 0) {
            usersText = `Det er ingen brukere`;
        }

        settingsGrid.innerHTML = justTextTemplate(usersText, "left");

        if (resp.allUsers[0].hasOwnProperty("id")) {

            const usersKeys = Object.keys(resp.allUsers);

            const defaultHTML = `
                <p class="settingsPendingUserFullName">Visningsnavn</p>
                <p class="settingsPendingUsername">Brukernavn</p>
                <p class="settingsPendingUsername">ID</p>
                <p class="settingsPendingUsername">Profil synlighet</p>
                <p class="settingsPendingUsername">API tilgang</p>
                `;

            settingsGrid.innerHTML += getCenteredTextTemplate(defaultHTML, "", "borderTop");

            for (let i = 0; i < usersKeys.length; i++) {

                const currentUser = resp.allUsers[usersKeys[i]];
                let myAccountColor = "";
                let profileStatus = `<p class="settingsPendingUsername" style="color:red;">Privat</p>`;

                let hasAPIAccessTxt = `<button style="padding:0;margin:0;" class="settingsAcceptPendingUser pointer" onClick="giveAPIAccess('${currentUser.username}','${currentUser.id}');">Gi API tilgang</button>`;

                if (allAPIUsersArr.includes(currentUser.id)) {
                    hasAPIAccessTxt = `<button style="padding:0;margin:0;" class="settingsDeclinePendingUser pointer" onClick="removeAPIAccess('${currentUser.username}','${currentUser.id}');">Fjern API tilgang</button>`;
                }

                if (currentUser.publicprofile === true) {
                    profileStatus = `<p class="settingsPendingUsername" style="color:green;">Offentlig</p>`;
                }

                if (currentUser.username === username) {
                    myAccountColor = "settingsHightlightUser";
                }

                let usersTemplateHTML = `
                   <p class="settingsPendingUserFullName ${myAccountColor}">${currentUser.displayname}</p>
                   <p class="settingsPendingUsername ${myAccountColor}">${currentUser.username}</p>
                   <p class="settingsPendingUsername">ID: ${currentUser.id}</p>
                   `;

                if (currentUser.username !== username) {
                    usersTemplateHTML += `
                    ${profileStatus}
                    <p class="settingsPendingUsername">${hasAPIAccessTxt}</p>
                   <br>
                   <button style="padding:0;margin:0;" class="settingsButton pointer" onClick="viewUser('${currentUser.id}');">Se profil</button>
                    `;
                } else {
                    usersTemplateHTML += `
                   <br>
                   <button style="padding:0;margin:0;" class="settingsButton pointer" onClick="viewUser('${currentUser.id}');">Din bruker</button>
                    `;
                }

                settingsGrid.innerHTML += getCenteredTextTemplate(usersTemplateHTML, "", "spacingTop");
            }
        }
    }

    settingsGrid.innerHTML += getBottomSpacingTemplate();
    scrollToSavedPos(setting);
    saveNewScrollPos = true;
}

async function loadPendingUsersPage(setting) {

    titleDom.innerHTML = ELoadSettings.pendingUsers.name;
    document.title = ELoadSettings.pendingUsers.name;

    const body = { "authToken": token, "userInfo": user };
    const url = `/users/list/pending`;

    const resp = await callServerAPI(body, url);

    let totalRequests = 0;
    if (resp[0].hasOwnProperty("username")) {
        totalRequests = resp.length
    }

    let HTMLText = `Det er totalt ${totalRequests} forespørseler<br>Godta eller avslå brukerene`;
    if (totalRequests === 1) {
        HTMLText = `Det er totalt ${totalRequests} forespørsel<br>Godta eller avslå brukeren`;
    } else if (totalRequests === 0) {
        HTMLText = `Det er ingen forespørseler`;
    }

    settingsGrid.innerHTML = justTextTemplate(HTMLText, "left");

    if (resp[0].hasOwnProperty("username") && sessionStorage.getItem("currentSetting") === ELoadSettings.pendingUsers.name) {

        const defaultHTML = `
       <p class="settingsPendingUserFullName">Visningsnavn</p>
       <p class="settingsPendingUsername">Brukernavn</p>
       <p class="settingsPendingUsername">Dager siden forespørselen ble sendt inn</p>
       `;

        settingsGrid.innerHTML += getCenteredTextTemplate(defaultHTML, "", "borderTop");

        const pendingUserKeys = Object.keys(resp);

        for (let i = 0; i < pendingUserKeys.length; i++) {

            let msg = "Ikke registrert";
            if (resp[i].request_date) {

                let requestDate = resp[i].request_date;
                requestDate = requestDate.split("T");
                requestDate = requestDate[0].split("-");

                if (requestDate[0].length === 4 && requestDate[1] > 0 && requestDate[1] <= 12 && requestDate[1].length <= 2 && requestDate[2] > 0 && requestDate[2] <= 31 && requestDate[2].length <= 2) {

                    const d = new Date();
                    requestDate = new Date(requestDate[0], (requestDate[1] - 1), requestDate[2]);

                    const daysSinceTime = parseInt((d - requestDate) / (1000 * 3600 * 24));

                    if (d < requestDate) {
                        //fremtiden
                    } else if (daysSinceTime > 1) {
                        msg = `${parseInt(daysSinceTime)} dager siden`;
                    } else if (daysSinceTime === 1) {
                        msg = `I går`;
                    } else if (daysSinceTime === 0) {
                        msg = `I dag`;
                    }
                }
            }

            const pendingTemplateHTML = `
       <p class="settingsPendingUserFullName">${resp[pendingUserKeys[i]].displayname}</p>
       <p class="settingsPendingUsername">${resp[pendingUserKeys[i]].username}</p>
       <p class="settingsPendingUsername">${msg}</p>
       <button class="settingsAcceptPendingUser pointer" onClick='acceptPendingUser("${resp[pendingUserKeys[i]].username}", true);'>Godta</button>
       <button class="settingsDeclinePendingUser pointer" onClick='acceptPendingUser("${resp[pendingUserKeys[i]].username}", false);'>Avslå</button>
       `;

            settingsGrid.innerHTML += getCenteredTextTemplate(pendingTemplateHTML, "infoAboutApp1", "spacingTop");

        }
    }

    settingsGrid.innerHTML += getBottomSpacingTemplate();
    scrollToSavedPos(setting);
    saveNewScrollPos = true;
}

async function loadAPIPage() {

    if (userInfo.hasOwnProperty("apikey")) {

        const config = {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        }

        const response = await fetch("/api", config);
        const data = await response.json();

        if (sessionStorage.getItem("currentSetting") === ELoadSettings.api.name) {

            settingsGrid.innerHTML = justTextTemplate(`${application.name} har ${data.length} APIer.<br>Her kan du se din API key, BrukerID og ulike APIer.`, "left");

            settingsGrid.innerHTML += getTemplate("API Key", "apiKeyDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.apikey}' readonly="readonly"></input>`, "borderTop");
            settingsGrid.innerHTML += getTemplate("BrukerID", "apiKeyDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.id}' readonly="readonly"></input>`);

            for (let i = 0; i < data.length; i++) {
                const text = `
        URL: ${data[i].url}
        <br><br>
        Metode: ${data[i].method}
        `;

                settingsGrid.innerHTML += getAPITextTemplate(text, "", "spacingTop");
            }

            settingsGrid.innerHTML += getCenteredTextTemplate("Eksempel:", "", "spacingTop");

            const firstAPIExample = data[0].url.split("/");
            let currentURL = window.location.href || "";
            currentURL = currentURL.split("/");
            currentURL = `${currentURL[0]}/${currentURL[2]}`;
            const exampleAPIHTML = `/${firstAPIExample[1]}/${userID}/${userInfo.apikey}`;
            const fullExampleAPIText = `${data[0].method} ${currentURL}${exampleAPIHTML}`;

            settingsGrid.innerHTML += getAPITextTemplate(fullExampleAPIText);

            settingsGrid.innerHTML += getCenteredTextTemplate("Response:", "", "spacingTop");

            let exampleAPIData = sessionStorage.getItem("cachedExAPIResp");

            if (!exampleAPIData) {

                const exampleAPIResponse = await fetch(exampleAPIHTML, config);
                exampleAPIData = await exampleAPIResponse.json();

                if (!exampleAPIData.hasOwnProperty("error")) {
                    exampleAPIData = JSON.stringify(exampleAPIData);
                    sessionStorage.setItem("cachedExAPIResp", exampleAPIData);
                } else {
                    exampleAPIData = JSON.stringify(exampleAPIData);
                }
            }

            if (sessionStorage.getItem("currentSetting") === ELoadSettings.api.name) {

                settingsGrid.innerHTML += getAPITextTemplate(exampleAPIData);

                settingsGrid.innerHTML += getBottomSpacingTemplate();
            }
        }
    } else {
        loadSetting(ELoadSettings.settings.name);
    }
}

async function loadPrivacyPage() {

    settingsGrid.innerHTML = justTextTemplate(`${application.name} samler ikke inn data fra brukeren sine.`, "left");

    settingsGrid.innerHTML += getCenteredTextTemplate(`
    <button id="detailsAboutMyAccountBtn" class='settingsButton pointer' onClick="displayInformationAboutUser();">Hent mine opplysninger</button>
    <p id="informationAboutUser" style="text-align:left;"></p>
    `, "", "borderTop");

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton pointer' onClick="loadSetting('${ELoadSettings.deleteMe.name}');">Gå til sletting av konto</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();

}

async function loadDeleteMePage() {

    settingsGrid.innerHTML = justTextTemplate(`Her kan du slette kontoen din. <strong>Dette kan ikke angres!</strong> <br><br> Du er pålogget som: ${userInfo.displayname}<br>Brukernavn: ${userInfo.username}`, "left");

    settingsGrid.innerHTML += getCenteredTextTemplate("Skriv inn brukernavnet ditt", "", "borderTop");
    settingsGrid.innerHTML += getCenteredTextTemplate("<input class='settingsInput' id='usernameInpDeletion' type='text' placeholder='Fyll inn'></input>");

    settingsGrid.innerHTML += getCenteredTextTemplate("Skriv inn ditt passordet ditt", "usernameDiv", "spacingTop");
    settingsGrid.innerHTML += getCenteredTextTemplate("<input class='settingsInput' id='passwordInpDeletion' type='password' placeholder='Fyll inn'></input>");

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' style='color:red;' onClick="deleteAccount()">Slett kontoen min</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();

}

async function acceptPendingUser(username, acceptOrDeny) {
    if (!username || acceptOrDeny === "") {
        return;
    }

    let statusMsg = "godta";
    let statusMsg2 = "Du har nå godtatt forespørselen til: ";

    if (!acceptOrDeny) {
        statusMsg = "avslå";
        statusMsg2 = "Du har nå avslått forespørselen til: ";
    }

    const confirmPress = confirm("Er du sikker på at du vil " + statusMsg + " " + username + " sin forespørsel?");
    if (confirmPress === true) {

        const body = { "authToken": token, "userInfo": user, "pendingUser": username, "acceptOrDeny": acceptOrDeny };
        const url = `/users/pending/${username}/${acceptOrDeny}`;

        const results = await callServerAPI(body, url);

        if (results === "Ok") {
            alert(statusMsg2 + username);
        } else {
            alert("Feil, brukeren finnes ikke!");
        }

        loadSetting(ELoadSettings.pendingUsers.name);
    }
}