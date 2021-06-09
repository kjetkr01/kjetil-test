function loadSetting(aSetting) {

    if (settings) {

        let setting = aSetting || sessionStorage.getItem("currentSetting") || ELoadSettings.settings.name;
        if (setting === `${ELoadSettings.aboutApp.name} (1)`) {
            setting = ELoadSettings.aboutApp.name;
        }

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

        else if (setting === ELoadSettings.medalsCounter.name) {
            cacheCurrentSetting(setting);
            loadMedalsCounterPage();
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
}

async function loadDefaultPage(setting) {

    titleDom.innerHTML = ELoadSettings.settings.name;
    settingsGrid.innerHTML = "";

    settingsGrid.innerHTML += getTemplate("Visningsnavn", "", `<input id="displaynameInp" maxlength="20" onKeydown="return validateDisplaynameInput();" style="text-align:right;" class='settingsInput' value='${userInfo.displayname}'></input><button onClick="saveDisplaynameConfirm();" style="display:none;" id="displaynameSaveBtn" class="settingsButton pointer">Lagre</button>`, "borderTop");
    settingsGrid.innerHTML += getTemplate("Brukernavn", "", `<input id="usernameInp" maxlength="20" onKeydown="return validateUsernameInput();" style="text-align:right;" class='settingsInput' value='${userInfo.username}'></input><button onClick="saveUsernameConfirm();" style="display:none;" id="usernameSaveBtn" class="settingsButton pointer">Lagre</button>`);

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

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.apperance.name, "", "spacingTop");
    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.progressionInfo.name);
    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.medalsCounter.name);

    let aboutAppTxt = `${ELoadSettings.aboutApp.name}`;

    if (sessionStorage.getItem("settings_notification_update") === "true") {
        aboutAppTxt = `${ELoadSettings.aboutApp.name} (1)`;
    }

    settingsGrid.innerHTML += getTemplateWithBtn(aboutAppTxt, "aboutAppDiv", "spacingTop");

    if (userInfo.hasOwnProperty("isadmin")) {
        if (userInfo.isadmin === true) {
            settingsGrid.innerHTML += getPendingRequestsTemplate();
        }
    }

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.users.name, "usersDiv");

    if (userInfo.hasOwnProperty("apikey")) {
        if (userInfo.apikey) {
            settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.api.name, "apiDiv");
        }
    }

    settingsGrid.innerHTML += getTemplateWithBtn(ELoadSettings.privacy.name);

    settingsGrid.innerHTML += getLogoutBtn();

    scrollToSavedPos(setting);

    if (userInfo.hasOwnProperty("isadmin")) {
        if (userInfo.isadmin === true) {

            const infoHeader = { "onlyNumbers": true };
            const url = `/users/list/pending`;

            const resp = await callServerAPIPost(infoHeader, url);

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

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton pointer' onClick="updatePassword();">Oppdater passord</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAboutMePage() {

    const gym = userInfo.gym || "";
    const age = userInfo.age || "";
    const height = userInfo.height || "";
    const weight = userInfo.weight || "";

    settingsGrid.innerHTML = justTextTemplate("Her kan du velge høyde, vekt og alder. Om profilen din er offentlig, vises dette til andre brukere", "left");

    settingsGrid.innerHTML += getTemplate("Treningssenter", "", `<input id="gymInp" style="text-align:right;" class='settingsInput' value='${gym}' maxlength="30"></input>`, "borderTop");
    settingsGrid.innerHTML += getTemplate("Alder", "", `<input id="ageInp" style="text-align:right;" class='settingsInput' value='${age}' type="number" maxlength="3">år</input>`);

    settingsGrid.innerHTML += getTemplate("Høyde", "", `<input id="heightInp" style="text-align:right;" class='settingsInput' value='${height}' type="number" maxlength="7">cm</input>`, "spacingTop");
    settingsGrid.innerHTML += getTemplate("Vekt", "", `<input id="weightInp" style="text-align:right;" class='settingsInput' value='${weight}' type="number" maxlength="7">kg</input>`);

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button id="updateAboutMeBtn" class='settingsButton pointer' onClick="aboutMeResetValues();">Tilbakestill verdier</button>`, "", "spacingTop");

    const checkIfEdited = setInterval(() => {

        if (!document.getElementById("gymInp") || isUpdatingAboutMe === true) {
            clearInterval(checkIfEdited);
        } else {

            const updateAboutMeBtn = document.getElementById("updateAboutMeBtn");
            const gymInp = document.getElementById("gymInp").value;
            const ageInp = document.getElementById("ageInp").value;
            const heightInp = document.getElementById("heightInp").value;
            const weightInp = document.getElementById("weightInp").value;

            const updateTxt = "Oppdater detaljer";
            const resetTxt = "Tilbakestill verdier";

            const change =
                gymInp !== gym
                ||
                ageInp !== age.toString()
                ||
                heightInp !== height.toString()
                ||
                weightInp !== weight.toString();

            if (change === false && updateAboutMeBtn.innerHTML !== resetTxt) {
                updateAboutMeBtn.innerHTML = resetTxt;
                updateAboutMeBtn.setAttribute("onClick", "aboutMeResetValues();");
            } else if (change === true && updateAboutMeBtn.innerHTML !== updateTxt) {
                updateAboutMeBtn.innerHTML = updateTxt;
                updateAboutMeBtn.setAttribute("onClick", "updateAboutMe();");
            }
        }

    }, 1000);

    settingsGrid.innerHTML += getBottomSpacingTemplate();
}

function loadAppearancePage() {

    let disabled = "";
    let pointer = `class="pointer"`;

    if (!navigator.onLine) {
        disabled = "disabled";
        pointer = "";
    }

    settingsGrid.innerHTML = justTextTemplate("Her kan du endre utseende på appen!", "left");

    const theme = user.getSetting("preferredtheme");

    const themes = {
        0: { "name": "Følg system", "theme": 0 },
        1: { "name": "Lys", "theme": 1 },
        2: { "name": "Mørk", "theme": 2 }
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
    <select ${disabled} id="appearanceThemeSelection" ${pointer}>
       ${appearanceThemeOptionsHTML}
    </select>
    `;

    settingsGrid.innerHTML += getTemplate("Tema", "appearanceThemeInp", appearanceThemeHTML, "borderTop");

    const colorThemeKeys = Object.keys(allowedColorThemes);
    let themeColorOptionsHTML = "";
    const preferredTheme = allowedColorThemes[user.getSetting("preferredcolortheme")].theme;

    for (let i = 0; i < colorThemeKeys.length; i++) {

        if (preferredTheme === allowedColorThemes[colorThemeKeys[i]].theme) {
            themeColorOptionsHTML += `<option selected="selected" value="${colorThemeKeys[i]}">${allowedColorThemes[colorThemeKeys[i]].name}</option>`;
        } else {
            themeColorOptionsHTML += `<option value="${colorThemeKeys[i]}">${allowedColorThemes[colorThemeKeys[i]].name}</option>`;
        }
    }

    const themeColorSelectionHTML = `
    <select ${disabled} id="themeColorSelection" ${pointer}>
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

    let disabled = "";
    let pointer = `class="pointer"`;

    if (!navigator.onLine) {
        disabled = "disabled";
        pointer = "";
    }

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
    <select ${disabled} id="badgeSizeSelection" ${pointer}>
       ${badeSizeOptionsHTML}
    </select>
    `;

    settingsGrid.innerHTML += getTemplate("Størrelse", "badgeSizeInp", badeSizeHTML, "borderTop");

    /* */

    const badgeDetailsObj = {
        0: { name: "Alt", value: 0 },
        1: { name: "KG/Reps igjen", value: 1 },
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

    let disabledTxt = "";
    if (settings.badgesize === badgeSizesObj[0].value) {
        disabledTxt = "disabled";
        pointer = "";
    }

    const badgeDetailsHTML = `
    <select ${disabledTxt} ${disabled} id="badgeDetailsSelection" ${pointer}>
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

function loadMedalsCounterPage() {

    settingsGrid.innerHTML = justTextTemplate("Her kan du se hvor mange medaljer du har! Du får 1 medalje for hver fullførte mål! Andre brukere kan se dette på profilen din. Du kan også se deres antall medaljer oppnådd.", "left");

    settingsGrid.innerHTML += getTemplate("Medaljer oppnådd", "", `${userInfo.medalscount}`, "spacingTop");

    if (userInfo.medalscount > 0) {

        settingsGrid.innerHTML += justTextTemplate("Har det oppstått en feil og du for mange medaljer? Under kan du fjerne medaljer", "left");

        settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton pointer' onClick="removeMedalConfirm(${userInfo.medalscount}, '1');">Fjern 1 medalje</button>`, "", "spacingTop");

        const numbers = ["10", "25"];

        for (let i = 0; i < numbers.length; i++) {
            const num = parseInt(numbers[i]);
            if (userInfo.medalscount >= num) {
                settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton pointer' onClick="removeMedalConfirm(${userInfo.medalscount}, '${num}');">Fjern ${num} medaljer</button>`, "", "spacingTop");
            }
        }
    }

    settingsGrid.innerHTML += getBottomSpacingTemplate();

}

async function loadAboutAppPage(setting) {

    const imageURL = new Image();
    imageURL.src = application.logoURL;

    imageURL.onload = async function () {

        if (sessionStorage.getItem("currentSetting") === ELoadSettings.aboutApp.name) {

            const imageHTML = `
            <img id="logo" src="${application.logoURL}" alt="" draggable="false" class="noselect settingsLogo"></img>
            `;

            settingsGrid.innerHTML = justTextTemplate(imageHTML, "center");

            //document.getElementById("logo").src = application.logoURL;

            const appInfoHTML = `
            <strong>${application.name}</strong>
            <br>
            <p id="applicationVersionEtc" class="settingsApplicationFullVersion">${application.version.full || application.version.fullNumber || ""}</p>
            <p id="newUpdateAvailable" class="settingsApplicationFullVersion"></p>
            `;

            settingsGrid.innerHTML += justTextTemplate(appInfoHTML, "center");

            if (settings.automaticupdates === true) {
                settingsGrid.innerHTML += getTemplateWithCheckbox("Oppdater automatisk", "", true, "automaticupdates", "spacingTop");
            } else {
                settingsGrid.innerHTML += getTemplateWithCheckbox("Oppdater automatisk", "", false, "automaticupdates", "spacingTop");
            }

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

            try {
                const allCaches = await caches.keys();
                if (allCaches.length > 0) {
                    let state = "not active";
                    if ('serviceWorker' in navigator) {
                        if (navigator.serviceWorker.controller) {
                            if (navigator.serviceWorker.controller.state) {
                                state = navigator.serviceWorker.controller.state;
                            }
                        }
                    }

                    const totalCacheSizeBytes = await cachesSize();
                    const totalCacheSizeMB = parseFloat(totalCacheSizeBytes / 1000000).toFixed(2);
                    settingsGrid.innerHTML += getCenteredTextTemplate(`
                    Service Worker: ${state}
                    <br>
                    ${allCaches} ~ ${totalCacheSizeMB || 0} MB
                    <br>
                    <button class="settingsButton pointer" onClick="deleteCachesConfirm();">Tøm cache</button>
                    `, "left", "spacingTop");
                }

            } catch (err) {
                console.log(err);
            }

            settingsGrid.innerHTML += getBottomSpacingTemplate();

            if (navigator.onLine) {
                const infoHeader = {};
                const url = `/application`;

                const serverApplication = await callServerAPIPost(infoHeader, url);
                if (serverApplication) {
                    if (serverApplication.version.fullNumber !== application.version.fullNumber) {
                        document.getElementById("newUpdateAvailable").innerHTML = `
                    Nyeste versjon: ${serverApplication.version.fullNumber}<br>
                    <button class="settingsButton pointer" onClick="updateApplication();">Oppdater</button>`;
                        sessionStorage.setItem("settings_notification_update", true);
                        scrollToSavedPos(setting, 25);
                    } else {
                        sessionStorage.removeItem("settings_notification_update");
                    }
                } else {
                    sessionStorage.removeItem("settings_notification_update");
                }
            } else {
                sessionStorage.removeItem("settings_notification_update");
            }

            scrollToSavedPos(setting);
            saveNewScrollPos = true;
        }
    }
}

async function loadUsersListPage(setting) {
    if (navigator.onLine) {

        const infoHeader = {};
        const url = `/users/list/all`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp.hasOwnProperty("allUsers")) {

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

                    resp.allUsers.sort(function (a, b) { return a.id - b.id });

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

                        let hasAPIAccessTxt = `<button style="padding:0;margin:0;" class="settingsAcceptPendingUser pointer" onClick="giveAPIAccessConfirm('${currentUser.username}','${currentUser.id}');">Gi API tilgang</button>`;

                        if (allAPIUsersArr.includes(currentUser.id)) {
                            hasAPIAccessTxt = `<button style="padding:0;margin:0;" class="settingsDeclinePendingUser pointer" onClick="removeAPIAccessConfirm('${currentUser.username}','${currentUser.id}');">Fjern API tilgang</button>`;
                        }

                        if (currentUser.publicprofile === true) {
                            profileStatus = `<p class="settingsPendingUsername" style="color:green;">Offentlig</p>`;
                        }

                        if (user && currentUser.username === user.getUsername()) {
                            myAccountColor = "settingsHightlightUser";
                        }

                        let usersTemplateHTML = `
                   <p class="settingsPendingUserFullName ${myAccountColor}">${currentUser.displayname}</p>
                   <p class="settingsPendingUsername ${myAccountColor}">${currentUser.username}</p>
                   <p class="settingsPendingUsername">ID: ${currentUser.id}</p>
                   `;

                        if (user && currentUser.username !== user.getUsername()) {
                            usersTemplateHTML += `
                    ${profileStatus}
                    <p class="settingsPendingUsername">${hasAPIAccessTxt}</p>
                    <br>
                    <button style="padding:0;margin:0;" class="settingsButton pointer" onClick="viewUser('${currentUser.id}');">Besøk</button>
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
            } else {

                resp.allUsers.sort(function (a, b) { return a.id - b.id });

                const usersKeys = Object.keys(resp.allUsers);

                let totalUsers = usersKeys.length;

                let usersText = `${application.name} har ${totalUsers} offentlige brukere<br>Her er listen med brukere`;
                if (totalUsers === 0) {
                    usersText = `Det er ingen brukere`;
                }

                settingsGrid.innerHTML = justTextTemplate(usersText, "left");

                for (let i = 0; i < usersKeys.length; i++) {

                    const currentUser = resp.allUsers[usersKeys[i]];

                    let myAccountColor = "";
                    if (user && currentUser.username === user.getUsername()) {
                        myAccountColor = "settingsHightlightUser";
                    }

                    let usersTemplateHTML = `
               <p class="settingsPendingUserFullName ${myAccountColor}">${currentUser.displayname}</p>
               <p class="settingsPendingUsername ${myAccountColor}">${currentUser.username}</p>
               <br>
               `;

                    if (user && currentUser.username !== user.getUsername()) {
                        usersTemplateHTML += `
               <button style="padding:0;margin:0;" class="settingsButton pointer" onClick="viewUser('${currentUser.id}');">Besøk</button>
                `;
                    } else {
                        usersTemplateHTML += `
               <button style="padding:0;margin:0;" class="settingsButton pointer" onClick="viewUser('${currentUser.id}');">Din bruker</button>
                `;
                    }

                    if (i === 0) {
                        settingsGrid.innerHTML += getCenteredTextTemplate(usersTemplateHTML, "", "borderTop");
                    } else {
                        settingsGrid.innerHTML += getCenteredTextTemplate(usersTemplateHTML, "", "spacingTop");
                    }
                }

            }
        }

        settingsGrid.innerHTML += getBottomSpacingTemplate();
        scrollToSavedPos(setting);
        saveNewScrollPos = true;
    } else {
        settingsGrid.innerHTML = justTextTemplate(`Kunne ikke laste inn listen med brukere. ${defaultTxt.noConnection}`, "left");
    }
}

async function loadPendingUsersPage(setting) {
    if (navigator.onLine) {

        titleDom.innerHTML = ELoadSettings.pendingUsers.name;
        document.title = ELoadSettings.pendingUsers.name;

        const infoHeader = {};
        const url = `/users/list/pending`;

        const resp = await callServerAPIPost(infoHeader, url);

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

            resp.sort(function (a, b) { return b.id - a.id });
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

                        if (d < requestDate || daysSinceTime === 0) {
                            //fremtiden
                            msg = `Fremtiden (${requestDate})`;
                        } else if (daysSinceTime === 1) {
                            msg = `I dag`;
                        } else if (daysSinceTime === 2) {
                            msg = `I går`;
                        } else if (daysSinceTime > 2) {
                            msg = `${parseInt(daysSinceTime)} dager siden`;
                        }
                    }
                }

                const pendingTemplateHTML = `
       <p class="settingsPendingUserFullName">${resp[pendingUserKeys[i]].displayname}</p>
       <p class="settingsPendingUsername">${resp[pendingUserKeys[i]].username}</p>
       <p class="settingsPendingUsername">${msg}</p>
       <button class="settingsAcceptPendingUser pointer" onClick='acceptPendingUserConfirm("${resp[pendingUserKeys[i]].username}", true);'>Godta</button>
       <button class="settingsDeclinePendingUser pointer" onClick='acceptPendingUserConfirm("${resp[pendingUserKeys[i]].username}", false);'>Avslå</button>
       `;

                settingsGrid.innerHTML += getCenteredTextTemplate(pendingTemplateHTML, "infoAboutApp1", "spacingTop");

            }
        }

        settingsGrid.innerHTML += getBottomSpacingTemplate();
        scrollToSavedPos(setting);
        saveNewScrollPos = true;
    } else {
        settingsGrid.innerHTML = justTextTemplate(`Kunne ikke laste inn listen med forespørsler. ${defaultTxt.noConnection}`, "left");
    }
}

async function loadAPIPage() {

    let response = null;

    try {
        const allCaches = await caches.keys();
        if (allCaches.length > 0) {
            const cache = await caches.open(allCaches[0]);
            if (cache) {
                response = await cache.match("/api");
            }
        }
    } catch {

    }

    if (userInfo.hasOwnProperty("apikey")) {

        if (sessionStorage.getItem("currentSetting") === ELoadSettings.api.name) {

            if (!response && navigator.onLine) {
                const config = {
                    method: "GET",
                    headers: {
                        "content-type": "application/json"
                    }
                }

                response = await fetch("/api", config);
            }

            if (response && response.status === 200 && user) {

                const data = await response.json();

                settingsGrid.innerHTML = justTextTemplate(`${application.name} har ${data.length} APIer.<br>Her kan du se din API key, BrukerID og ulike APIer.`, "left");

                settingsGrid.innerHTML += getTemplate("API Key", "apiKeyDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.apikey}' readonly="readonly"></input>`, "borderTop");
                settingsGrid.innerHTML += getTemplate("BrukerID", "apiKeyDiv", `<input style="text-align:right;" class='settingsInput' value='${userInfo.id}' readonly="readonly"></input>`);

                for (let i = 0; i < data.length; i++) {
                    let noteTxt = "";
                    if (data[i].note) {
                        if (data[i].note.length > 0) {
                            noteTxt = `<br><br>Notis: ${data[i].note}`;
                        }
                    }

                    const text = `
                    URL: ${data[i].url}
                    <br><br>
                    Metode: ${data[i].method}
                    <br><br>
                    Headers: ${data[i].headers}
                    ${noteTxt}
                    `;

                    settingsGrid.innerHTML += getAPITextTemplate(text, "", "spacingTop");
                }

                settingsGrid.innerHTML += getCenteredTextTemplate("Eksempel Request:", "", "spacingTop");

                const exampleConfig = {
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                        "uid": userInfo.id.toString(),
                        "key": userInfo.apikey
                    }
                }

                const firstAPIExample = data[0].url.split("/");
                let currentURL = window.location.href || "";
                currentURL = currentURL.split("/");
                currentURL = `${currentURL[0]}/${currentURL[2]}`;
                const exampleAPIHTML = `${firstAPIExample[1]}`;
                const fullExampleAPIText = `
                ${data[0].method} ${currentURL}/${exampleAPIHTML}
                <br><br>
                Headers: ${JSON.stringify(exampleConfig.headers)}
                `;

                settingsGrid.innerHTML += getAPITextTemplate(fullExampleAPIText);

                settingsGrid.innerHTML += getCenteredTextTemplate("Eksempel Response:", "", "spacingTop");

                const days = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
                const dayNum = new Date().getDay();
                const day = days[dayNum];
                const rList = ["Bryst", "Skuldre", "Rygg", "Biceps", "Triceps", "Bein", "Mage"];

                const rNum = Math.floor(Math.random() * 2);

                const rExample = [];

                randomFromList();

                function randomFromList() {
                    const r = rList[Math.floor(Math.random() * rList.length)];
                    //prevents duplicates ;)
                    if (!rExample.includes(r) && rExample.length < 2) {
                        rExample.push(r);
                    } else {
                        randomFromList();
                    }
                }

                if (rNum === 1) {
                    randomFromList();
                }

                const exampleAPIResult = `{"currentDay":"${day}","todaysWorkout":"Skal du trene ${rExample.join(" og ")}"}`;

                settingsGrid.innerHTML += getAPITextTemplate(exampleAPIResult);

                settingsGrid.innerHTML += getBottomSpacingTemplate();

            } else {
                if (!navigator.onLine) {
                    settingsGrid.innerHTML = justTextTemplate("Kunne ikke laste inn listen med APIer. Vennligst prøv igjen når du har Internett-tilkobling.", "left");
                } else {
                    settingsGrid.innerHTML = justTextTemplate("Det her oppstått en feil, kunne ikke laste inn listen med APIer.", "left");
                }
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

    settingsGrid.innerHTML += getCenteredTextTemplate(`<button class='settingsButton pointer' style='color:red;' onClick="deleteAccountConfirm()">Slett kontoen min</button>`, "", "spacingTop");

    settingsGrid.innerHTML += getBottomSpacingTemplate();

}