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

async function updateUserInfo() {

    if (navigator.onLine) {
        const resp = await getAccountDetails(userID);
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

            localStorage.setItem("userSettings", JSON.stringify(resp.info.settings));

        }
    }

    if (!userInfo) {
        const cachedDetails_owner = JSON.parse(localStorage.getItem("cachedDetails_owner"));
        userInfo = cachedDetails_owner;
    }

    //settings = resp.info.settings;

    const currentSetting = sessionStorage.getItem("currentSetting") || ELoadSettings.settings;

    loadSetting(currentSetting);
}

function scrollToSavedPos(setting, extraScroll) {

    let currentScroll = parseInt(sessionStorage.getItem(`@scroll-${setting}`));
    if (!isNaN(currentScroll)) {

        if (extraScroll > 0 && currentScroll < 25) {
            currentScroll = extraScroll;
        }

        if (currentScroll) {
            settingsDom.scrollTo(0, currentScroll);
        }
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

let loadingInformationAboutUser = false;
async function displayInformationAboutUser() {
    if (loadingInformationAboutUser === false) {
        if (navigator.onLine) {

            const informationAboutUser = document.getElementById("informationAboutUser");

            // prevents spam loading of information
            if (informationAboutUser.innerHTML.length < 150) {

                loadingInformationAboutUser = true;

                informationAboutUser.innerHTML = `<br>Henter opplysninger...`;

                const infoHeader = {};
                const url = `/user/allinformation`;

                const resp = await callServerAPIPost(infoHeader, url);

                informationAboutUser.innerHTML = "";

                if (resp) {

                    const keys = Object.keys(resp);

                    try {

                        for (let i = 0; i < keys.length; i++) {

                            const first = resp[keys[i]];
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
                document.getElementById("detailsAboutMyAccountBtn").innerHTML = "Hent mine opplysninger";
                informationAboutUser.innerHTML = "";
            }
        } else {
            informationAboutUser.innerHTML = `<br>Kunne ikke hente opplysningene dine. Mangler internettforbindelse.`;
        }
    }
}

async function deleteAccount() {
    if (navigator.onLine) {

        const usernameInpDeletion = document.getElementById("usernameInpDeletion").value;
        const passwordInpDeletion = document.getElementById("passwordInpDeletion").value;

        if (usernameInpDeletion && usernameInpDeletion.length >= 3 && passwordInpDeletion) {

            if (usernameInpDeletion === username) {

                const confirmAccountDeletion = confirm(`Er du sikkert på at du ønsker å slette kontoen din? Dette kan ikke angres!`);

                if (confirmAccountDeletion === true) {

                    // delete account

                    const body = { "authorization": "Basic " + window.btoa(`${usernameInpDeletion}:${passwordInpDeletion}`) };
                    const url = `/user/deleteMe`;

                    const config = {
                        method: "POST",
                        headers: {
                            "content-type": "application/json",
                            "authtoken": token,
                            "userinfo": user
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
    } else {
        alert("Du må ha internettforbindelse for å kunne slette kontoen din!");
    }
}

async function giveAPIAccess(aUsername, aID) {

    if (aID && aUsername) {

        const giveAPIUsername = aUsername;
        const giveAPIID = parseInt(aID);

        const confirmGiveAPIAccess = confirm(`Er du sikker på at du ønsker å gi ${giveAPIUsername} (${giveAPIID}) API tilgang?`);

        if (confirmGiveAPIAccess === true) {

            const infoHeader = { "giveAPIUserAccess": giveAPIID };
            const url = `/user/giveAPIAccess`;

            const resp = await callServerAPIPost(infoHeader, url);

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

            const infoHeader = { "removeAPIUserAccess": removeAPIID };
            const url = `/user/removeAPIAccess`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {
                alert(`${removeAPIUsername} har ikke lengre API tilgang!`);
            } else {
                alert(`Det har oppståtte en feil. ${removeAPIUsername} kunne ikke fjerne API tilgang.`);
            }

            loadSetting(ELoadSettings.users.name);

        }

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

            const remainingMedals = aMedalsCount - count;
            let remainingTxt = ` Du kommer til å ha ${remainingMedals} igjen!`;

            if (remainingMedals <= 0) {
                remainingTxt = ` Du kommer ikke til å ha noen medaljer igjen!`;
            }

            let medalsTxt = "medalje";
            if (count > 1) {
                medalsTxt += "r";
            }

            const confirmRemove = confirm(`Er du sikker ønsker å fjerne ${count} ${medalsTxt}?${remainingTxt}`);

            if (confirmRemove === true) {
                const infoHeader = { "count": count };
                const url = `/user/details/decrease/medalscount`;

                const resp = await callServerAPIPost(infoHeader, url);

                if (resp === true) {
                    updateUserInfo();
                    loadSetting();
                }

            }
        }
    } else {
        alert("Det kreves internettforbindelse for å fjerne 1 medalje!");
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