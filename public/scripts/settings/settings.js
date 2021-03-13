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

async function updateCheckboxSetting(aSetting, aValue) {

    const setting = aSetting;
    const value = aValue;

    const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
    const url = `/user/update/settings/${setting}`;

    const resp = await callServerAPI(body, url);

    if (resp === true) {
        location.reload();
    }

}