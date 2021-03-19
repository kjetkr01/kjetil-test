function loadSetting(aSetting) {

    const setting = aSetting;
    if (setting) {
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

        else {
            document.title = ELoadSettings.settings.name;
            cacheCurrentSetting(ELoadSettings.settings.name);
            loadDefaultPage(ELoadSettings.settings.name);
        }

        /*
        switch (setting) {
            case [ELoadSettings.password]:
                cacheCurrentSetting(setting);
                loadPasswordPage();
                break;
            case ELoadSettings.aboutMe:
                cacheCurrentSetting(setting);
                loadAboutMePage();
                break;
            case "Utseende":
                cacheCurrentSetting(setting);
                loadAppearancePage();
                break;
            case "Fremgangs info":
                cacheCurrentSetting(setting);
                loadProgressionInfoPage();
                break;
            case "Om appen":
                cacheCurrentSetting(setting);
                loadAboutAppPage(setting);
                break;
            case "pendingUsers":
                cacheCurrentSetting(setting);
                loadPendingUsersPage(setting);
                break;
            case "Brukere":
                cacheCurrentSetting(setting);
                loadUsersListPage(setting);
                break;
            case "API":
                cacheCurrentSetting(setting);
                loadAPIPage();
                break;
            default:
                document.title = ELoadSettings.settings;
                cacheCurrentSetting(setting);
                loadDefaultPage(setting);
                break;
        }*/
    }
}

async function loadDefaultPage(setting) {

    titleDom.innerHTML = ELoadSettings.settings.name;
    settingsGrid.innerHTML = "";

    settingsGrid.innerHTML += getTemplate("Visningsnavn", "displaynameDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.displayname}'></input>`, "borderTop");
    settingsGrid.innerHTML += getTemplate("Brukernavn", "usernameDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.username}'></input>`);

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.password.name, "passwordDiv");

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.aboutMe.name, "aboutDiv", "spacingTop");

    if (settings.publicProfile === true) {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Privat profil", "profileVisibilityDiv", true, "publicProfile", "spacingTop");
    } else {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Privat profil", "profileVisibilityDiv", false, "publicProfile", "spacingTop");
    }

    if (settings.displayLeaderboards === true) {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Ledertavler synlighet", "leaderboardsVisibilityDiv", true, "displayLeaderboards");
    } else {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Ledertavler synlighet", "leaderboardsVisibilityDiv", false, "displayLeaderboards");
    }

    if (settings.displayWorkoutList === true) {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Trener i dag listen synlighet", "workoutTodayListDiv", true, "displayWorkoutList");
    } else {
        settingsGrid.innerHTML += getTemplateWithCheckbox("Trener i dag listen synlighet", "workoutTodayListDiv", false, "displayWorkoutList");
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

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="alert('savepsw');">Oppdater passord</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAboutMePage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du velge høyde, vekt og alder. Om profilen din er offentlig, vises dette til andre brukere", "left");

    settingsGrid.innerHTML += getTemplate("Treningssenter", "", `<input id="gymInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.gym}'></input>`, "borderTop");
    settingsGrid.innerHTML += getTemplate("Alder", "", `<input id="ageInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.age}'>år</input>`);

    settingsGrid.innerHTML += getTemplate("Høyde", "", `<input id="heightInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.height}'>cm</input>`, "spacingTop");
    settingsGrid.innerHTML += getTemplate("Vekt", "", `<input id="weightInp" style="text-align:right;" class='settingsInput' value='${userInfo.info.weight}'>kg</input>`);

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="alert('updateDetails');">Oppdater detaljer</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="aboutMeResetValues();">Tilbakestill verdier</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAppearancePage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du endre utseende på appen!", "left");

    const appearanceThemeHTML = `
    <select id="appearanceThemeSelection">
       <option value="1">Automatisk</option>
</select>
    `;

    settingsGrid.innerHTML += getTemplate("Tema", "appearanceThemeInp", appearanceThemeHTML, "borderTop");

    const themeKeys = Object.keys(allowedThemes);
    let themeColorOptionsHTML = "";
    let colorTheme = allowedThemes[0].theme;
    const preferredTheme = sessionStorage.getItem("colorTheme") || colorTheme;
    for (let i = 0; i < themeKeys.length; i++) {

        if (preferredTheme === allowedThemes[themeKeys[i]].theme) {
            themeColorOptionsHTML += `<option selected="selected" value="${themeKeys[i]}">${allowedThemes[themeKeys[i]].name}</option>`;
        } else {
            themeColorOptionsHTML += `<option value="${themeKeys[i]}">${allowedThemes[themeKeys[i]].name}</option>`;
        }
    }

    const themeColorSelectionHTML = `
    <select id="themeColorSelection">
  ${themeColorOptionsHTML}
</select>
    `;

    settingsGrid.innerHTML += getTemplate("Farge-tema", "themeColorInp", themeColorSelectionHTML);

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="saveApperanceSettings();">Lagre endringer</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadProgressionInfoPage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du endre hvor mye informasjon du ønsker å se på startsiden!", "left");

    const badeSizeHTML = `
    <select id="badgeSizeSelection">
       <option value="1">Stor</option>
       <option value="2">Liten</option>
</select>
    `;

    settingsGrid.innerHTML += getTemplate("Størrelse", "badgeSizeInp", badeSizeHTML, "borderTop");

    const badgeInfoHTML = `
    <select id="badeInfoSelection">
       <option value="1">Alt</option>
       <option value="2">KG igjen</option>
       <option value="3">% fremgang</option>
</select>
    `;

    settingsGrid.innerHTML += getTemplate("Informasjon", "badeInfoInp", badgeInfoHTML);

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="alert('saveDetails');">Lagre endringer</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAboutAppPage(setting) {

    const imageURL = new Image();
    imageURL.src = "images/appIcon.png";

    imageURL.onload = function () {

        if (sessionStorage.getItem("currentSetting") === ELoadSettings.aboutApp.name) {

            const imageHTML = `
            <img id="logo" src="images/appIcon.png" alt="" draggable="false" class="noselect settingsLogo"></img>
            `;

            settingsGrid.innerHTML = justTextTemplate(imageHTML, "center");

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
        }

        scrollToSavedPos(setting);
        saveNewScrollPos = true;
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
            allAPIUsersArr.push(resp.allAPIUsers[i].username);
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
                let profileStatus = `<p class="settingsPendingUsername" style="color:green;">Offentlig</p>`;

                let hasAPIAccessTxt = `<button class="settingsAcceptPendingUser" onClick="alert('giveAPIAccess');">Gi API tilgang</button>`;

                if (allAPIUsersArr.includes(currentUser.username)) {
                    hasAPIAccessTxt = `<button class="settingsDeclinePendingUser" onClick="alert('removeAPIAccess');">Fjern API tilgang</button>`;
                }

                if (currentUser.settings.publicProfile === true) {
                    profileStatus = `<p class="settingsPendingUsername" style="color:red;">Privat</p>`;
                }

                const usersTemplateHTML = `
                   <p class="settingsPendingUserFullName">${currentUser.displayname}</p>
                   <p class="settingsPendingUsername">${currentUser.username}</p>
                   <p class="settingsPendingUsername">${currentUser.id}</p>
                   ${profileStatus}
                   <p class="settingsPendingUsername">${hasAPIAccessTxt}</p>
                   <br>
                   <button class="settingsButton" onClick="viewUser('${currentUser.id}');">Se profil</button>
                   `;

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
       `;

        settingsGrid.innerHTML += getCenteredTextTemplate(defaultHTML, "", "borderTop");

        const pendingUserKeys = Object.keys(resp);

        for (let i = 0; i < pendingUserKeys.length; i++) {
            const pendingTemplateHTML = `
       <p class="settingsPendingUserFullName">${resp[pendingUserKeys[i]].displayname}</p>
       <p class="settingsPendingUsername">${resp[pendingUserKeys[i]].username}</p>
       <button class="settingsAcceptPendingUser" onClick='acceptPendingUser("${resp[pendingUserKeys[i]].username}", true);'>Godta</button>
       <button class="settingsDeclinePendingUser" onClick='acceptPendingUser("${resp[pendingUserKeys[i]].username}", false);'>Avslå</button>
       `;

            settingsGrid.innerHTML += getCenteredTextTemplate(pendingTemplateHTML, "infoAboutApp1", "spacingTop");

        }
    }

    settingsGrid.innerHTML += getBottomSpacingTemplate();
    scrollToSavedPos(setting);
    saveNewScrollPos = true;
}

async function loadAPIPage() {

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

        const exampleAPIResponse = await fetch(exampleAPIHTML, config);
        const exampleAPIData = await exampleAPIResponse.json();

        if (sessionStorage.getItem("currentSetting") === ELoadSettings.api.name) {

            settingsGrid.innerHTML += getAPITextTemplate(JSON.stringify(exampleAPIData));

            settingsGrid.innerHTML += getBottomSpacingTemplate();
        }
    }

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