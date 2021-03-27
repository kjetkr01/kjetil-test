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
};

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

    console.log(usernameInp)

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
            }, 10);


        } else if (aType === "username") {

            setTimeout(() => {
                const usernameInp = document.getElementById("usernameInp").value;

                if (usernameInp !== userInfo.username) {
                    document.getElementById("usernameSaveBtn").style.display = "inline-block";
                } else {
                    document.getElementById("usernameSaveBtn").style.display = "none";
                }
            }, 10);
        }
    }
}