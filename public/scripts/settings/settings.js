const ELoadSettings = {
    settings: {
        name: `Innstillinger`,
        value: 1
    },
    password: {
        name: `Passord`,
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
    aboutApp: {
        name: `Om appen`,
        value: 6
    },
    pendingUsers: {
        name: `Forespørsler`,
        value: 7
    },
    users: {
        name: `Brukere`,
        value: 8
    },
    api: {
        name: `API`,
        value: 9
    },
    privacy: {
        name: `Personvern`,
        value: 10
    },
    deleteMe: {
        name: `Slett meg`,
        value: 11
    }
};

// Lage rettigheter eller lignende i innstillinger helt i bunnen? Feks sånn der man kan hente alt av info om brukeren, hva det brukes til ogsånt? Erklæringsting, Personvern ting

async function updateUserInfo() {

    const resp = await getAccountDetails(userID);

    if (resp.hasOwnProperty("info")) {

        userInfo = resp.info;
        //settings = resp.info.settings;
        sessionStorage.setItem("userSettings", JSON.stringify(resp.info.settings));

        const currentSetting = sessionStorage.getItem("currentSetting") || ELoadSettings.settings;

        loadSetting(currentSetting);

    } else {
        redirectToAccount();
    }
}

function scrollToSavedPos(setting) {

    const currentScroll = sessionStorage.getItem(`@scroll-${setting}`);

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
    const logout = confirm("Er du sikker på at du vil logge ut?");

    if (logout === true) {
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem("cachedUsername", username);
        redirectToLogin();
    }
}

function aboutMeResetValues() {
    const domList = ["gymInp", "ageInp", "heightInp", "weightInp"];

    for (let i = 0; i < domList.length; i++) {
        if (domList[i] === "gymInp") {
            document.getElementById(domList[i]).value = "";
        } else {
            document.getElementById(domList[i]).value = 0;
        }
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

async function displayInformationAboutUser() {

    const informationAboutUser = document.getElementById("informationAboutUser");
    informationAboutUser.innerHTML = `<br>Henter opplysninger...`;

    const body = { "authToken": token, "userInfo": user };
    const url = `/user/allinformation`;

    const resp = await callServerAPI(body, url);

    if (resp) {
        informationAboutUser.innerHTML = `<br>${JSON.stringify(resp)}`;
    } else {
        informationAboutUser.innerHTML = `<br>Det her oppstått en feil, kunne ikke hente opplysningene dine. Vennligst prøv igjen.`;
    }
}

async function deleteAccount() {

    const usernameInpDeletion = document.getElementById("usernameInpDeletion").value;
    const passwordInpDeletion = document.getElementById("passwordInpDeletion").value;

    if (usernameInpDeletion && usernameInpDeletion.length >= 3 && passwordInpDeletion) {

        if (usernameInpDeletion === username) {

            const confirmAccountDeletion = confirm(`Er du sikkert på at du ønsker å slette kontoen din? Dette kan ikke angres!`);

            if (confirmAccountDeletion === true) {

                // delete account

                const body = { "authToken": token, "userInfo": user, "authorization": "Basic " + window.btoa(`${usernameInpDeletion}:${passwordInpDeletion}`) };
                const url = `/user/deleteMe`;

                const config = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }

                const response = await fetch(url, config);
                const data = await response.json();

                if (data.status === true) {
                    sessionStorage.clear();
                    localStorage.clear();
                    alert(`${data.message} Takk for at du var medlem av ${application.name}`);
                    location.reload();
                } else {
                    alert(`Det har oppstått en feil: ${data.message}`);
                }
            }

        } else {
            alert("Brukernavnet stemmer ikke med kontoen")
        }

    } else {
        alert("Vennligst fyll ut feltene");
    }
}

async function giveAPIAccess(aUsername, aID) {

    if (aID && aUsername) {

        const giveAPIUsername = aUsername;
        const giveAPIID = parseInt(aID);

        const confirmGiveAPIAccess = confirm(`Er du sikker på at du ønsker å gi ${giveAPIUsername} (${giveAPIID}) API tilgang?`);

        if (confirmGiveAPIAccess === true) {

            const body = { "authToken": token, "userInfo": user, "giveAPIUserAccess": giveAPIID };
            const url = `/user/giveAPIAccess`;

            const resp = await callServerAPI(body, url);

            if (resp === true) {
                alert(`${giveAPIUsername} har nå fått API tilgang!`);
            } else {
                alert(`Det har oppståtte en feil. ${giveAPIUsername} kunne ikke få API tilgang.`);
            }

            loadSetting(ELoadSettings.users.name);

        }

    }
}

async function removeAPIAccess(aUsername, aID) {

    if (aID && aUsername) {

        const removeAPIUsername = aUsername;
        const removeAPIID = parseInt(aID);

        const confirmRemoveAPIAccess = confirm(`Er du sikker på at du ønsker å fjerne ${removeAPIUsername} (${removeAPIID}) sin API tilgang?`);

        if (confirmRemoveAPIAccess === true) {

            const body = { "authToken": token, "userInfo": user, "removeAPIUserAccess": removeAPIID };
            const url = `/user/removeAPIAccess`;

            const resp = await callServerAPI(body, url);

            if (resp === true) {
                alert(`${removeAPIUsername} har ikke lengre API tilgang!`);
            } else {
                alert(`Det har oppståtte en feil. ${removeAPIUsername} kunne ikke fjerne API tilgang.`);
            }

            loadSetting(ELoadSettings.users.name);

        }

    }
}