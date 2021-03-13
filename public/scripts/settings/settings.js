async function updateUserInfo() {

    const resp = await getAccountDetails(userID);

    if (resp.hasOwnProperty("info")) {

        userInfo = resp.info;
        settings = resp.info.settings;

        const currentSetting = sessionStorage.getItem("currentSetting") || "Innstillinger";

        loadSetting(currentSetting);

    } else {
        redirectToAccount();
    }
}

function scrollToSavedPos() {
    if (savedScrollPos) {
        settingsDom.scrollTo(0, savedScrollPos);
    }
}

function backToPrevious() {
    if (titleDom.innerHTML === "Innstillinger") {
        redirectToAccount();
    } else {
        loadSetting("Innstillinger");
    }

}

function cacheCurrentSetting(aCurrentSetting) {
    if (!aCurrentSetting) {
        aCurrentSetting = "Innstillinger";
    }

    const currentSetting = aCurrentSetting;

    sessionStorage.setItem("currentSetting", currentSetting);

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

function aboutMeDefaultValues() {
    document.getElementById("heightInp").value = 172.5;
    document.getElementById("weightInp").value = 70.8;
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