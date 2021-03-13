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
        sessionStorage.removeItem("currentSetting");
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