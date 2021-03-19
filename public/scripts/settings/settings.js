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
        settings = resp.info.settings;

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
        console.log(123)
        sessionStorage.removeItem(`@scroll-${ELoadSettings[ELoadSettingsKeys[i]].name}`);
    }
}

function confirmLogout() {
    const logout = confirm("Er du sikker på at du vil logge ut?");

    if (logout === true) {
        localStorage.clear();
        sessionStorage.clear();
        redirectToLogin();
    }
}

let isUpdatingSetting = false;

async function updateCheckboxSetting(aSetting, aValue) {

    if (isUpdatingSetting === false) {

        isUpdatingSetting = true;

        const inputCategory = document.getElementsByClassName("inputCategory");

        for (let i = 0; i < inputCategory.length; i++) {
            inputCategory[i].setAttribute("disabled", true);
        }

        const setting = aSetting;
        const value = aValue;

        const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPI(body, url);

        if (resp === true) {
            updateUserInfo();
            loadSetting();
            isUpdatingSetting = false;
        }
    }
}

function aboutMeResetValues() {
    const domList = ["gymInp", "ageInp", "heightInp", "weightInp"];

    for (let i = 0; i < domList.length; i++) {
        document.getElementById(domList[i]).value = "";
    }
}

async function saveApperanceSettings() {

    if (isUpdatingSetting === false) {

        isUpdatingSetting = true;

        //const theme = document.getElementById("appearanceThemeSelection").value;
        const colorTheme = document.getElementById("themeColorSelection").value;
        let value = colorTheme;
        let setting = "preferredColorTheme";

        const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPI(body, url);

        if (resp === true) {

            const lastColorTheme = document.getElementById(`themeStyleCSS-${preferredColorTheme}`);

            const newColorTheme = allowedThemes[value].theme;

            if (newColorTheme !== sessionStorage.getItem("colorTheme") && checkAllowedThemes.includes(newColorTheme) === true) {
                preferredColorTheme = allowedThemes[value].theme;
                sessionStorage.setItem("colorTheme", preferredColorTheme);
                lastColorTheme.href = `styles/themes/${preferredColorTheme}.css`;
                lastColorTheme.id = `themeStyleCSS-${preferredColorTheme}`;
            }

            updateUserInfo();
            loadSetting();
            changeColorTheme();
            isUpdatingSetting = false;


        }
    }

}