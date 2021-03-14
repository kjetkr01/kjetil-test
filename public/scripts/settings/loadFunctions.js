function loadSetting(aSetting) {

    const setting = aSetting;
    if (setting) {
        titleDom.innerHTML = setting;
        settingsGrid.innerHTML = "";
        switch (setting) {
            case "Passord":
                cacheCurrentSetting(setting);
                loadPasswordPage();
                break;
            case "Om deg":
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
                loadAboutAppPage();
                break;
            case "pendingUsers":
                cacheCurrentSetting(setting);
                loadPendingUsersPage();
                break;
            case "Brukere":
                cacheCurrentSetting(setting);
                loadUsersListPage();
                break;
            case "API":
                cacheCurrentSetting(setting);
                loadAPIPage();
                break;
            default:
                cacheCurrentSetting(setting);
                loadDefaultPage();
                scrollToSavedPos();
                break;
        }
    }
}

async function loadDefaultPage() {

    titleDom.innerHTML = "Innstillinger";
    settingsGrid.innerHTML = "";

    settingsGrid.innerHTML += getTemplate("Visningsnavn", "displaynameDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.displayname}'></input>`, "borderTop");
    settingsGrid.innerHTML += getTemplate("Brukernavn", "usernameDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.username}'></input>`);

    settingsGrid.innerHTML += getTemplateWithBtn("Passord", "passwordDiv");

    settingsGrid.innerHTML += getTemplateWithBtn("Om deg", "aboutDiv", "spacingTop");

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

    settingsGrid.innerHTML += getTemplateWithBtn("Utseende", "appearanceDiv", "spacingTop");
    settingsGrid.innerHTML += getTemplateWithBtn("Fremgangs info", "appearanceDiv");

    settingsGrid.innerHTML += getTemplateWithBtn("Om appen", "aboutAppDiv", "spacingTop");

    if (userInfo.hasOwnProperty("isadmin")) {
        if (userInfo.isadmin === true) {
            settingsGrid.innerHTML += getPendingRequestsTemplate();
            settingsGrid.innerHTML += getTemplateWithBtn("Brukere", "usersDiv");
        }
    }

    if (userInfo.hasOwnProperty("apikey")) {
        settingsGrid.innerHTML += getTemplateWithBtn("API", "apiDiv");
    }

    settingsGrid.innerHTML += getLogoutBtn();

    if (userInfo.hasOwnProperty("isadmin")) {
        if (userInfo.isadmin === true) {

            const body = { "authToken": token, "userInfo": user, "onlyNumbers": true };
            const url = `/users/list/pending`;

            const resp = await callServerAPI(body, url);

            if (resp) {
                if (resp[0].hasOwnProperty("id")) {
                    const pendingRequestsTxt = document.getElementsByName("pendingRequestsTxt");
                    pendingRequestsTxt[0].innerHTML = `Forespørsler (${resp.length})`;
                }
            }
        }
    }
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

    const badeInfoHTML = `
    <select id="badeInfoSelection">
       <option value="1">Alt</option>
       <option value="2">KG igjen</option>
       <option value="3">% fremgang</option>
</select>
    `;

    settingsGrid.innerHTML += getTemplate("Informasjon", "badeInfoInp", badeInfoHTML);

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton' onClick="alert('saveDetails');">Lagre endringer</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAboutAppPage() {

    const imageURL = new Image();
    imageURL.src = "images/appIcon.png";

    const imageHTML = `
        <img id="logo" src="images/appIcon.png" alt="" draggable="false" class="noselect settingsLogo"></img>
        `;

    settingsGrid.innerHTML = justTextTemplate(imageHTML, "center");

    const appInfoHTML = `
        <strong>${applicationName}</strong>
        <br>
        <p class="settingsApplicationFullVersion">${applicationFullVersion}</p>
        `;

    settingsGrid.innerHTML += justTextTemplate(appInfoHTML, "center");

    const html = `
        ${applicationName} er et app prosjekt utviklet av <button class="settingsButtonHighlightUser" onClick="viewUser('3');">Kjetil Kristiansen</button>.

        <br><br>
        Appen ble hovedsakling laget for å enkelt se ORM (One Rep Max) i ulike løft.
        Kunne lage mål i ulike øvelser og enkelt sjekke progresjon og hvor langt man er unna målet.

        <br><br>
        Ha muligheten til å opprette treningsplaner, samt legge inn øvelser per dag.
        Siden appen er koblet til et database system, vil muligheten for å se andre brukere sine løft, mål, progresjon og treningsplaner være veldig enkelt.

        <br><br>
        Hjelp til design:
        <button class="settingsButtonHighlightUser" onClick="viewUser('2');">Christoffer Simonsen</button>,
        Christian Jenssen,
        Mandius Abelsen,
        <button class="settingsButtonHighlightUser" onClick="viewUser('41');">Szilard Andri Reynisson</button>,
        Sondre Olsen.
        `;

    settingsGrid.innerHTML += getCenteredTextTemplate(html, "", "spacingTop");

    const infoHTML = `
        Prosjekt oppstart: 20.11.2020
        <br>
        Full rework: 19.01.2021
        <br>
        Sist oppdatert: ${applicationUpdateDate}
        `;

    settingsGrid.innerHTML += getCenteredTextTemplate(infoHTML, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

async function loadUsersListPage() {

    const body = { "authToken": token, "userInfo": user };
    const url = `/users/list/all`;

    const resp = await callServerAPI(body, url);

    if (resp.hasOwnProperty("allUsers") && resp.hasOwnProperty("allAPIUsers")) {

        let totalUsers = 0;
        const allAPIUsersArr = [];

        for (let i = 0; i < resp.allAPIUsers.length; i++) {
            allAPIUsersArr.push(resp.allAPIUsers[i].username);
        }

        let totalAPIUsers = allAPIUsersArr.length;
        if (resp.allUsers[0].hasOwnProperty("id")) {
            totalUsers = resp.allUsers.length
        }

        let usersText = `${applicationName} har ${totalUsers} brukere<br>${totalAPIUsers} av brukerene har API tilgang<br>Her er listen med brukere`;
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
                `;

            settingsGrid.innerHTML += getCenteredTextTemplate(defaultHTML, "", "borderTop");

            for (let i = 0; i < usersKeys.length; i++) {

                const currentUser = resp.allUsers[usersKeys[i]];

                let hasAPIAccessTxt = `<button class="settingsAcceptPendingUser" onClick="alert('giveAPIAccess');">Gi API tilgang</button>`;

                if (allAPIUsersArr.includes(currentUser.username)) {
                    hasAPIAccessTxt = `<button class="settingsDeclinePendingUser" onClick="alert('removeAPIAccess');">Fjern API tilgang</button>`;
                }

                const usersTemplateHTML = `
                   <p class="settingsPendingUserFullName" onClick="viewUser('${currentUser.id}');">${currentUser.displayname}</p>
                   <p class="settingsPendingUsername" onClick="viewUser('${currentUser.id}');">${currentUser.username}</p>
                   <p class="settingsPendingUsername">${currentUser.id}</p>
                   <p class="settingsPendingUsername">${hasAPIAccessTxt}</p>
                   `;

                settingsGrid.innerHTML += getCenteredTextTemplate(usersTemplateHTML, "", "spacingTop");
            }
        }

    }

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

async function loadPendingUsersPage() {

    titleDom.innerHTML = "Forespørsler";

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

    if (resp[0].hasOwnProperty("username")) {

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

    settingsGrid.innerHTML = justTextTemplate(`${applicationName} har ${data.length} APIer.<br>Her kan du se din API key, BrukerID og ulike APIer.`, "left");

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

    settingsGrid.innerHTML += getAPITextTemplate(JSON.stringify(exampleAPIData));

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

        loadSetting("pendingUsers");
    }
}