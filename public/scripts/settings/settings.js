const ELoadSettings = {
    settings: {
        name: `Innstillinger`,
        value: 1
    },
    password: {
        name: `Endre Passord`,
        value: 2
    },
    aboutMe: {
        name: `Om deg`,
        value: 3
    },
    apperance: {
        name: `Utseende`,
        value: 4
    },
    progressionInfo: {
        name: `Fremgangs info`,
        value: 5
    },
    medalsCounter: {
        name: `Medaljer`,
        value: 6
    },
    aboutApp: {
        name: `Om appen`,
        value: 7
    },
    pendingUsers: {
        name: `Forespørsler`,
        value: 8
    },
    users: {
        name: `Brukere`,
        value: 9
    },
    api: {
        name: `API`,
        value: 10
    },
    privacy: {
        name: `Personvern`,
        value: 11
    },
    deleteMe: {
        name: `Slett meg`,
        value: 12
    }
};

async function updateUserInfo(aSkipReqData) {

    if (navigator.onLine && aSkipReqData !== true) {
        const resp = await getAccountDetails(user.getId());
        if (resp) {

            const rInfo = resp.info;
            userInfo = {
                id: rInfo.id,
                displayname: rInfo.displayname,
                username: rInfo.username,
                isadmin: rInfo.isadmin,
                apikey: rInfo.apikey,
                gym: rInfo.info.gym,
                age: rInfo.info.age,
                height: rInfo.info.height,
                weight: rInfo.info.weight,
                medalscount: rInfo.info.medalscount,
            };

            settings = resp.info.settings;

        }
    }

    if (!userInfo) {
        const userDetails = user.getDetails();
        userDetails.id = user.getId();
        userDetails.username = user.getUsername();
        userDetails.displayname = user.getDisplayname();
        userInfo = userDetails;
    }

    if (!settings) {
        settings = user.getSettings();
    }

    const currentSetting = sessionStorage.getItem("currentSetting") || ELoadSettings.settings;

    loadSetting(currentSetting);
}

function scrollToSavedPos(setting, extraScroll) {

    let currentScroll = parseInt(sessionStorage.getItem(`@scroll-${setting}`));
    if (isNaN(currentScroll)) {
        currentScroll = 0;
    }

    if (extraScroll > 0 && currentScroll < 25) {
        currentScroll = extraScroll;
    }

    if (currentScroll) {
        settingsDom.scrollTo(0, currentScroll);
    }
}

function backToPrevious() {
    if (titleDom.innerHTML === ELoadSettings.settings.name) {
        clearAllScrollPos();
        redirectToAccount();
    } else if (titleDom.innerHTML === ELoadSettings.deleteMe.name) {
        loadSetting(ELoadSettings.privacy.name);
    } else {
        const currentSetting = sessionStorage.getItem("currentSetting");
        sessionStorage.removeItem(`@scroll-${currentSetting}`);
        loadSetting(ELoadSettings.settings.name);
    }
}

function cacheCurrentSetting(aCurrentSetting) {
    if (!aCurrentSetting) {
        aCurrentSetting = ELoadSettings.settings.name;
    }

    const currentSetting = aCurrentSetting;

    sessionStorage.setItem("currentSetting", currentSetting);
}

function clearAllScrollPos() {
    const ELoadSettingsKeys = Object.keys(ELoadSettings);
    for (let i = 0; i < ELoadSettingsKeys.length; i++) {
        sessionStorage.removeItem(`@scroll-${ELoadSettings[ELoadSettingsKeys[i]].name}`);
    }
}

function confirmLogout() {

    /*const logout = confirm("Er du sikker på at du vil logge ut?");

    if (logout === true) {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("cachedUsername", user.getUsername());
        redirectToLogin();
    }*/

    showConfirm("Er du sikker på at du vil logge ut?", `localStorage.clear();sessionStorage.clear();sessionStorage.setItem('cachedUsername', '${user.getUsername()}');redirectToLogin();`);
}

function aboutMeResetValues() {
    const domList = ["gymInp", "ageInp", "heightInp", "weightInp"];

    for (let i = 0; i < domList.length; i++) {
        document.getElementById(domList[i]).value = "";
    }
}

function validateDisplaynameInput() {

    const displaynameInp = document.getElementById("displaynameInp").value;
    const letters = /^[A-Za-z0-9 ]+$/;

    if (displaynameInp.length !== 0 && !displaynameInp.match(letters)) {
        return false;
    }

    checkIfEdited("displayname");

}

function validateUsernameInput() {

    const usernameInp = document.getElementById("usernameInp").value;
    const letters = /^[A-Za-z0-9]+$/;

    if (usernameInp.length !== 0 && !usernameInp.match(letters) || event.keyCode === 32) {
        return false;
    }

    checkIfEdited("username");

}

function checkIfEdited(aType) {

    if (aType) {

        if (aType === "displayname") {

            setTimeout(() => {
                const displaynameInp = document.getElementById("displaynameInp").value;

                if (displaynameInp !== userInfo.displayname) {
                    document.getElementById("displaynameSaveBtn").style.display = "inline-block";
                } else {
                    document.getElementById("displaynameSaveBtn").style.display = "none";
                }
            }, 100);

        } else if (aType === "username") {

            setTimeout(() => {
                const usernameInp = document.getElementById("usernameInp");

                usernameInp.value = (usernameInp.value).toLowerCase();

                if (usernameInp.value !== userInfo.username) {
                    document.getElementById("usernameSaveBtn").style.display = "inline-block";
                } else {
                    document.getElementById("usernameSaveBtn").style.display = "none";
                }
            }, 10);
        }
    }
}

async function acceptPendingUserConfirm(username, acceptOrDeny) {
    if (!username || acceptOrDeny === "") {
        return;
    }

    let statusMsg = "godta";

    if (!acceptOrDeny) {
        statusMsg = "avslå";
    }

    showConfirm("Er du sikker på at du vil " + statusMsg + " " + username + " sin forespørsel?", `acceptPendingUser('${username}', ${acceptOrDeny})`);

}

async function acceptPendingUser(username, acceptOrDeny) {
    if (!username || acceptOrDeny === "") {
        return;
    }

    let statusMsg = "Du har nå godtatt forespørselen til: ";

    if (!acceptOrDeny) {
        statusMsg = "Du har nå avslått forespørselen til: ";
    }

    const infoHeader = { "pendingUser": username, "acceptOrDeny": acceptOrDeny };
    const url = `/users/pending/${username}/${acceptOrDeny}`;

    const results = await callServerAPIPost(infoHeader, url);

    if (results === "Ok") {
        //alert(statusMsg2 + username);
        showAlert(statusMsg + username, true);
    } else {
        //alert("Feil, brukeren finnes ikke!");
        showAlert("Feil, brukeren finnes ikke!", true);
    }

    loadSetting(ELoadSettings.pendingUsers.name);
}

async function displayInformationAboutUser() {

    const informationAboutUser = document.getElementById("informationAboutUser");

    if (informationAboutUser.innerHTML.length < 150) {

        informationAboutUser.innerHTML = `<br>Henter opplysninger...`;

        const url = `/user/allinformation`;

        let resp = null;
        let fromCache = false;
        let cacheName = "";

        const allCaches = await caches.keys();
        if (allCaches.length > 0) {
            const cache = await caches.open(allCaches[0]);
            if (cache) {
                resp = await cache.match(url);
                if (resp) {
                    fromCache = true;
                    cacheName = allCaches[0];
                }
            }
        }

        if (!resp && navigator.onLine) {
            const config = {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser())
                }
            }

            resp = await fetch(url, config);
        }

        if (resp && resp.status === 200) {

            const data = await resp.json();

            informationAboutUser.innerHTML = "";

            if (data) {

                const keys = Object.keys(data);

                try {

                    for (let i = 0; i < keys.length; i++) {

                        const first = data[keys[i]];
                        const extraKeys = Object.keys(first);

                        for (let j = 0; j < extraKeys.length; j++) {

                            const second = first[extraKeys[j]];

                            if (keys[i] === "løft" || keys[i] === "mål") {

                                if (second.length > 0) {

                                    if (j === 0) {
                                        informationAboutUser.innerHTML += `<br><h2>${capitalizeFirstLetter(keys[i])}</h2>`;
                                    }

                                    const extraKeys2 = Object.keys(second);
                                    informationAboutUser.innerHTML += `<br><h3>${capitalizeFirstLetter(extraKeys[j])}</h3>`;

                                    for (let k = 0; k < extraKeys2.length; k++) {
                                        const third = second[extraKeys2[k]];
                                        const extraKeys3 = Object.keys(third);
                                        informationAboutUser.innerHTML += `<br>`;
                                        for (let x = 0; x < extraKeys3.length; x++) {
                                            informationAboutUser.innerHTML += `${capitalizeFirstLetter(extraKeys3[x])}: ${third[extraKeys3[x]]}<br>`;
                                        }
                                    }
                                }

                            } else if (keys[i] === "treningsplan") {

                                if (j === 0) {
                                    informationAboutUser.innerHTML += `<br><h2>${capitalizeFirstLetter(keys[i])}</h2><br>`;
                                }

                                const extraKeys2 = Object.keys(second);

                                for (let k = 0; k < extraKeys2.length; k++) {
                                    const third = second[extraKeys2[k]];
                                    if (third.short !== undefined && third.list !== undefined) {
                                        const extraKeys3 = Object.keys(third);
                                        informationAboutUser.innerHTML += `<br><h3>${capitalizeFirstLetter(extraKeys2[k])}</h3>`;
                                        for (let x = 0; x < extraKeys3.length; x++) {
                                            if (extraKeys3[x] === "list" && third.list.length > 0) {
                                                informationAboutUser.innerHTML += `<br><h3>${capitalizeFirstLetter(extraKeys3[x])}</h3>`;
                                                const extraKeys4 = Object.keys(third.list[0]);
                                                for (let b = 0; b < extraKeys4.length; b++) {
                                                    const fourth = third.list[0][extraKeys4[b]];
                                                    informationAboutUser.innerHTML += `<br><h4>${capitalizeFirstLetter(extraKeys4[b])}:</h4>`;
                                                    for (let l = 0; l < fourth.length; l++) {
                                                        const extraKeys5 = Object.keys(fourth[l]);
                                                        for (let n = 0; n < extraKeys5.length; n++) {
                                                            informationAboutUser.innerHTML += `${capitalizeFirstLetter(extraKeys5[n])}: ${fourth[l][extraKeys5[n]]}<br>`;
                                                        }
                                                        if (l !== fourth.length - 1) {
                                                            informationAboutUser.innerHTML += `<br>`;
                                                        }
                                                    }
                                                }
                                            } else {
                                                informationAboutUser.innerHTML += `${capitalizeFirstLetter(extraKeys3[x])}: ${third[extraKeys3[x]]}<br>`;
                                            }
                                        }
                                    } else {
                                        if (k === extraKeys2.length - 1) {
                                            informationAboutUser.innerHTML += `<br>`;
                                        }
                                        informationAboutUser.innerHTML += `${capitalizeFirstLetter(extraKeys2[k])}: ${third}<br>`;
                                    }
                                }

                            } else {

                                if (j === 0) {
                                    informationAboutUser.innerHTML += `<br><h2>${capitalizeFirstLetter(keys[i])}</h2>`;
                                }

                                informationAboutUser.innerHTML += `${capitalizeFirstLetter(extraKeys[j])}: ${second}<br>`;

                            }
                        }
                    }

                    if (fromCache === true) {
                        let extraTxt = "";
                        if (navigator.onLine) {
                            extraTxt = `
                            <button class="settingsButton pointer" onClick="showConfirm('Ønsker du å hente nyeste data? (Krever Internett-forbindelse)', 'deleteInfoCache();');">Hent nyeste data</button>`;
                        }
                        informationAboutUser.innerHTML += `
                        <br>Informasjonen ble hentet fra cache.
                        Data kan være litt utdatert.
                        ${extraTxt}`;
                    }

                } catch {

                    informationAboutUser.innerHTML = `Data vises som JSON<br>`;

                    for (let i = 0; i < keys.length; i++) {
                        informationAboutUser.innerHTML += `<br><strong>${capitalizeFirstLetter(keys[i])}</strong>`;
                        informationAboutUser.innerHTML += `<br>${JSON.stringify(resp[keys[i]])}<br>`;
                    }
                }

                document.getElementById("detailsAboutMyAccountBtn").innerHTML = "Mine opplysninger";
                setTimeout(() => {
                    loadingInformationAboutUser = false;
                }, 1000);

            } else {
                informationAboutUser.innerHTML = `<br>Det her oppstått en feil, kunne ikke hente opplysningene dine. Vennligst prøv igjen.`;
            }

        } else {
            if (!navigator.onLine) {
                informationAboutUser.innerHTML = `<br>Kunne ikke hente opplysningene dine. Krever Internett-tilkobling for å laste ned nytt innhold.`;
            } else {
                informationAboutUser.innerHTML = `<br>Det her oppstått en feil, kunne ikke hente opplysningene dine. Vennligst prøv igjen.`;
            }
        }

    } else {
        document.getElementById("detailsAboutMyAccountBtn").innerHTML = "Hent mine opplysninger";
        informationAboutUser.innerHTML = "";
    }
}

async function deleteInfoCache() {

    const allCaches = await caches.keys();
    if (allCaches.length > 0) {
        const cacheName = allCaches[0];
        const url = "/user/allinformation";

        const cache = await caches.open(cacheName);
        if (cache) {
            await cache.delete(url);
            document.getElementById("informationAboutUser").innerHTML = "";
            displayInformationAboutUser();
        }
    }
}

async function deleteAccountConfirm() {
    if (navigator.onLine) {

        const usernameInpDeletion = document.getElementById("usernameInpDeletion").value;
        const passwordInpDeletion = document.getElementById("passwordInpDeletion").value;

        if (usernameInpDeletion && usernameInpDeletion.length >= 3 && passwordInpDeletion) {

            if (usernameInpDeletion === user.getUsername()) {

                showConfirm(`Er du sikkert på at du ønsker å slette kontoen din? Dette kan ikke angres!`, "deleteAccount();");

            } else {
                //alert("Brukernavnet stemmer ikke med kontoen")
                showAlert(`Brukernavnet stemmer ikke med kontoen`, true);
            }

        } else {
            //alert("Vennligst fyll ut feltene");
            showAlert(`Vennligst fyll ut feltene!`, true);
        }
    } else {
        //alert("Du må ha Internett-tilkobling for å kunne slette kontoen din!");
        showAlert(`Du må ha Internett-tilkobling for å kunne slette kontoen din!`, true);
    }
}

async function deleteAccount() {
    if (navigator.onLine) {

        const usernameInpDeletion = document.getElementById("usernameInpDeletion").value;
        const passwordInpDeletion = document.getElementById("passwordInpDeletion").value;

        if (usernameInpDeletion && usernameInpDeletion.length >= 3 && passwordInpDeletion) {

            if (usernameInpDeletion === user.getUsername()) {

                // delete account

                const body = { "authorization": "Basic " + window.btoa(`${usernameInpDeletion}:${passwordInpDeletion}`) };
                const url = `/user/deleteMe`;

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
                const data = await response.json();

                if (data.status === true) {
                    sessionStorage.clear();
                    localStorage.clear();
                    //alert(`${data.message} Takk for at du var medlem av ${application.name}`);
                    //location.reload();
                    showAlert(`${data.message} Takk for at du var medlem av ${application.name}`, true, "redirectToLogin();");
                } else {
                    //alert(`Det har oppstått en feil: ${data.message}`);
                    showAlert(`Det har oppstått en feil: ${data.message}`, true);
                }

            } else {
                //alert("Brukernavnet stemmer ikke med kontoen")
                showAlert(`Brukernavnet stemmer ikke med kontoen`, true);
            }

        } else {
            //alert("Vennligst fyll ut feltene");
            showAlert(`Vennligst fyll ut feltene!`, true);
        }
    } else {
        //alert("Du må ha Internett-tilkobling for å kunne slette kontoen din!");
        showAlert(`Du må ha Internett-tilkobling for å kunne slette kontoen din!`, true);
    }
}

async function giveAPIAccessConfirm(aUsername, aID) {

    if (aID && aUsername) {

        showConfirm(`Er du sikker på at du ønsker å gi ${aUsername} (${aID}) API tilgang?`, `giveAPIAccess('${aUsername}', '${aID}');`);

    }
}

async function giveAPIAccess(aUsername, aID) {

    if (aID && aUsername) {

        const giveAPIUsername = aUsername;
        const giveAPIID = parseInt(aID);

        const infoHeader = { "giveAPIUserAccess": giveAPIID };
        const url = `/user/giveAPIAccess`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp !== true) {
            //alert(`Det har oppståtte en feil. ${giveAPIUsername} kunne ikke få API tilgang.`);
            showAlert(`Det har oppstått en feil. ${giveAPIUsername} kunne ikke få API tilgang!`, true);
        }

        loadSetting(ELoadSettings.users.name);

    }
}

async function removeAPIAccessConfirm(aUsername, aID) {

    if (aID && aUsername) {

        showConfirm(`Er du sikker på at du ønsker å fjerne ${aUsername} (${aID}) sin API tilgang?`, `removeAPIAccess('${aUsername}', '${aID}');`);

    }
}

async function removeAPIAccess(aUsername, aID) {

    if (aID && aUsername) {

        const removeAPIUsername = aUsername;
        const removeAPIID = parseInt(aID);

        const infoHeader = { "removeAPIUserAccess": removeAPIID };
        const url = `/user/removeAPIAccess`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp !== true) {
            //alert(`Det har oppståtte en feil. ${removeAPIUsername} kunne ikke fjerne API tilgang.`);
            showAlert(`Det har oppståtte en feil. ${removeAPIUsername} kunne ikke fjerne API tilgang`, true);
        }

        loadSetting(ELoadSettings.users.name);

    }
}

async function removeMedalConfirm(aMedalsCount, aCount) {

    if (navigator.onLine) {

        if (aMedalsCount > 0) {

            aCount = parseInt(aCount);
            if (isNaN(aCount)) {
                aCount = 1;
            }

            const count = aCount;

            const remainingMedals = aMedalsCount - count;
            let remainingTxt = ` Du kommer til å ha ${remainingMedals} igjen!`;

            if (remainingMedals <= 0) {
                remainingTxt = ` Du kommer ikke til å ha noen medaljer igjen!`;
            }

            let medalsTxt = "medalje";
            if (count > 1) {
                medalsTxt += "r";
            }

            showConfirm(`Er du sikker ønsker å fjerne ${count} ${medalsTxt}?${remainingTxt}`, `removeMedal(${aMedalsCount}, ${count});`);

        }
    } else {
        //alert("Det kreves Internett-tilkobling for å fjerne medaljer!");
        showAlert("Det kreves Internett-tilkobling for å fjerne medaljer!", true);
    }
}

async function removeMedal(aMedalsCount, aCount) {

    if (navigator.onLine) {

        if (aMedalsCount > 0) {

            aCount = parseInt(aCount);
            if (isNaN(aCount)) {
                aCount = 1;
            }

            const count = aCount;

            const infoHeader = { "count": count };
            const url = `/user/details/decrease/medalscount`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {
                updateUserInfo();
                loadSetting();
            }
        }
    } else {
        //alert("Det kreves Internett-tilkobling for å fjerne medaljer!");
        showAlert("Det kreves Internett-tilkobling for å fjerne medaljer!", true);
    }
}

// returns approximate size of a single cache (in bytes)
function cacheSize(c) {
    return c.keys().then(a => {
        return Promise.all(
            a.map(req => c.match(req).then(res => res.clone().blob().then(b => b.size)))
        ).then(a => a.reduce((acc, n) => acc + n, 0));
    });
}

// returns approximate size of all caches (in bytes)
function cachesSize() {
    return caches.keys().then(a => {
        return Promise.all(
            a.map(n => caches.open(n).then(c => cacheSize(c)))
        ).then(a => a.reduce((acc, n) => acc + n, 0));
    });
}