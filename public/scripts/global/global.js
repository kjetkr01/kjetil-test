// global variables

let user = null, lockedBody = false, allowedLifts = null, allowedGoals = null;

const repsSM = 10; // 1 rep * 10 (repsSM) = 10 points. 1 kg = 1 point

const defaultTxt = {
    "noConnection": "Ingen Internett-tilkobling"
}

const errorText = "Det har oppstått en feil!";
const loadingText = "Laster...";
const errorLoadingText = "Kunne ikke laste inn innholdet.";

const allowedThemes = {
    0: { "id": 0, "name": "Standard", "theme": "default" },
    1: { "id": 1, "name": "Blå", "theme": "blue" },
    2: { "id": 2, "name": "Blå (Test) (Full)", "theme": "blue_full" },
    3: { "id": 3, "name": "Blå (Test) (Full m/ gradient)", "theme": "blue_full_gradient" }
}

const themeColors = {
    "default": { "lightHex": "327a94", "darkHex": "1c4553" },
    "blue": { "lightHex": "3247bb", "darkHex": "202b6b" },
    "blue_full": { "lightHex": "1378bb", "darkHex": "09314b" },
    "blue_full_gradient": { "lightHex": "b6d7ec", "darkHex": "1e2830" }
}

try {
    if (sessionStorage.getItem("allowedLifts")) {
        allowedLifts = JSON.parse(sessionStorage.getItem("allowedLifts"));
    }
    if (sessionStorage.getItem("allowedGoals")) {
        allowedGoals = JSON.parse(sessionStorage.getItem("allowedGoals"));
    }
} catch {
}

const themeKeys = Object.keys(allowedThemes);
const checkAllowedThemes = [];
for (let i = 0; i < themeKeys.length; i++) {
    checkAllowedThemes.push(allowedThemes[themeKeys[i]].theme);
}

//

// create global user class

function createUserClass() {

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const userObj = localStorage.getItem("user") || sessionStorage.getItem("user");
    const detailsObj = localStorage.getItem("userDetails") || sessionStorage.getItem("userDetails");
    const settingsObj = localStorage.getItem("userSettings") || sessionStorage.getItem("userSettings");

    if (token && userObj && settingsObj) {
        try {

            user = new TUser(token, JSON.parse(userObj), JSON.parse(detailsObj), JSON.parse(settingsObj));

            // redirects to login if token is invalid
            if (navigator.onLine) {
                validateToken();
                async function validateToken() {

                    const currentPage = window.location.pathname;

                    const blackListedPages = ["/access.html", "/login.html", "/userlifts.html"];

                    //blacklists login pages
                    if (blackListedPages.includes(currentPage)) {

                        console.log(`"${currentPage}" is a blacklisted page, skipped token verification`);
                        return;

                    } else {

                        if (user) {

                            const infoHeader = {};
                            const url = `/validate`;

                            const resp = await callServerAPIPost(infoHeader, url);

                            if (!resp) {
                                userError();
                            }

                        } else {
                            userError();
                        }
                    }
                }
            }

        } catch (err) {
            userError();
        }

    } else {
        userError();
    }

    function userError() {
        const userErrorTxt = "Det har oppstått en feil. Du blir nå logget ut.";
        const maxWaitTime = 1000;
        let waitTime = 0;
        localStorage.clear();
        sessionStorage.clear();
        let waitUntilDomIsLoaded = setInterval(() => {
            waitTime++;
            if (waitTime < maxWaitTime) {
                if (document.getElementById("TSAlertOverlay")) {
                    clearInterval(waitUntilDomIsLoaded);
                    showAlert(userErrorTxt, true, "redirectToLogin();");
                }
            } else {
                alert(userErrorTxt) // Took too long
                redirectToLogin();
            }
        }, 100);
    }
}

// User class (for logged inn user)
function TUser(aToken, aUser, aDetails, aSettings) {

    const token = aToken;

    const user = {
        "id": aUser.id,
        "displayname": aUser.displayname,
        "username": aUser.username
    }

    const details = aDetails;

    const settings = aSettings;

    this.getToken = function () {
        return token;
    }

    this.getUser = function () {
        return user;
    }

    this.getId = function () {
        return user.id;
    }

    this.getDisplayname = function () {
        return user.displayname;
    }

    this.getUsername = function () {
        return user.username;
    }

    this.getDetails = function () {
        return details;
    }

    this.getDetail = function (aDetail) {
        if (details) {
            return details[aDetail.toLowerCase()];
        } else {
            return null;
        }
    }

    this.changeDetail = function (aDetail, aValue) {
        const detail = aDetail.toLowerCase();
        if (details && details.hasOwnProperty(detail)) {
            details[detail] = aValue;
            console.log(`SUCCESS : user.changeDetail() : "${detail}" = ${aValue}`); // debug for now
            if (localStorage.getItem("user")) {
                localStorage.setItem("userDetails", JSON.stringify(details));
            } else {
                sessionStorage.setItem("userDetails", JSON.stringify(details));
            }
        } else {
            console.log(`ERROR : user.changeDetail() : "${detail}" = ${aValue}`); // debug for now
        }
    }

    this.getSettings = function () {
        return settings;
    }

    this.getSetting = function (aSetting) {
        return settings[aSetting.toLowerCase()];
    }

    this.changeSetting = function (aSetting, aValue) {
        const setting = aSetting.toLowerCase();
        if (settings.hasOwnProperty(setting)) {
            settings[setting] = aValue;
            console.log(`SUCCESS : user.changeSetting() : "${setting}" = ${aValue}`); // debug for now
            if (localStorage.getItem("user")) {
                localStorage.setItem("userSettings", JSON.stringify(settings));
            } else {
                sessionStorage.setItem("userSettings", JSON.stringify(settings));
            }
        } else {
            console.log(`ERROR : user.changeSetting() : "${setting}" = ${aValue}`); // debug for now
        }
    }
}




// changeColorTheme

function changeColorTheme() {

    let colorTheme = allowedThemes[0].theme;
    let theme = 0;

    if (user) {
        if (allowedThemes[user.getSetting("preferredcolortheme")]) {
            colorTheme = allowedThemes[user.getSetting("preferredcolortheme")].theme;
        }
        theme = user.getSetting("preferredtheme");
    }

    const themeColorDOM = document.getElementById("themeColor");
    const themeColor = themeColors[colorTheme];

    if (theme === 1) {
        themeColorDOM.content = `#${themeColor.lightHex}`;
        document.body.classList = `${colorTheme}ColorTheme-light lightMode`;
    } else if (theme === 2) {
        themeColorDOM.content = `#${themeColor.darkHex}`;
        document.body.classList = `${colorTheme}ColorTheme-dark darkMode`;
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // dark mode
            themeColorDOM.content = `#${themeColor.darkHex}`;
            document.body.classList = `${colorTheme}ColorTheme-dark darkMode`;
        } else {
            // light mode
            themeColorDOM.content = `#${themeColor.lightHex}`;
            document.body.classList = `${colorTheme}ColorTheme-light lightMode`;
        }
    }

    if (lockedBody === true) {
        document.body.classList.add("lockedBody");
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkIfAllowedScheme);

function checkIfAllowedScheme(e) {
    const newColorScheme = e.matches ? "dark" : "light";
    let theme = 0;
    if (user) {
        theme = user.getSetting("preferredtheme");
    }

    if (theme === 0) {
        if (newColorScheme === "dark" || newColorScheme === "light") {
            changeColorTheme();
        }
    }
}

//

//

function lockBodyPosition() {

    if (window.navigator.standalone === true) {

        if (document.body.classList !== "lockedBody") {

            document.body.classList.add("lockedBody");
            lockedBody = true;

            window.addEventListener("scroll", (e) => {

                const element = document.getElementById("page");

                if (element) {

                    const isOwerflown = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;

                    if (isOwerflown === false) {
                        e.preventDefault();
                    }
                }
            });
        }
    }
}


function viewUser(viewUser) {

    if (viewUser) {
        redirectToUser(viewUser);
    }
}

//

async function callServerAPIPost(aInfoBody, aUrl) {

    if (!window.navigator.onLine) {
        return;
    }

    if (!aUrl) {
        return;
    }

    let userInfoObj = null;
    let token = null;
    if (user) {
        userInfoObj = JSON.stringify(user.getUser());
        token = user.getToken();
    }

    const config = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authtoken": token,
            "userinfo": userInfoObj,
        },
        body: JSON.stringify(aInfoBody)
    }

    const response = await fetch(aUrl, config);
    const data = await response.json();

    if (response.status === 200 || data.includes("opptatt") || data.includes("privat")) {
        return data;
    } else {
        console.log("not returning data, recieved status:" + response.status)
    }
}


// get user/owner information
async function getAccountDetails(aUserID) {
    if (navigator.onLine) {

        if (user) {

            const viewingUser = aUserID;

            const infoHeader = { "viewingUser": viewingUser };
            const url = `/users/details/${viewingUser}`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp) {

                if (resp.hasOwnProperty("updatedUserObject")) {

                    if (localStorage.getItem("user")) {
                        localStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                        localStorage.setItem("userDetails", JSON.stringify(resp.userDetails));
                        localStorage.setItem("userSettings", JSON.stringify(resp.info.settings));
                    } else {
                        sessionStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                        sessionStorage.setItem("userDetails", JSON.stringify(resp.userDetails));
                        sessionStorage.setItem("userSettings", JSON.stringify(resp.info.settings));
                    }

                    if (resp.info.hasOwnProperty("activetrainingsplit")) {
                        localStorage.setItem("cachedActiveTrainingsplit_owner", JSON.stringify(resp.info.activetrainingsplit));
                    } else {
                        localStorage.removeItem("cachedActiveTrainingsplit_owner");
                    }

                    if (resp.info.hasOwnProperty("alltrainingsplits")) {
                        localStorage.setItem("cachedAllTrainingsplits_owner", JSON.stringify(resp.info.alltrainingsplits));
                    } else {
                        localStorage.removeItem("cachedAllTrainingsplits_owner");
                    }

                    if (resp.info.hasOwnProperty("allowedLifts")) {
                        sessionStorage.setItem("allowedLifts", JSON.stringify(resp.info.allowedLifts));
                    }
                    if (resp.info.hasOwnProperty("allowedGoals")) {
                        sessionStorage.setItem("allowedGoals", JSON.stringify(resp.info.allowedGoals));
                    }

                    const newColorTheme = allowedThemes[resp.info.settings.preferredcolortheme].theme;

                    if (user && user.getSetting("preferredcolortheme") !== resp.info.settings.preferredcolortheme && checkAllowedThemes.includes(newColorTheme) === true) {

                        user.changeSetting("preferredcolortheme", resp.info.settings.preferredcolortheme);

                        changeColorTheme();
                    }

                    const newTheme = resp.info.settings.preferredtheme;

                    if (user && user.getSetting("preferredtheme") !== newTheme) {

                        user.changeSetting("preferredtheme", resp.info.settings.preferredtheme);

                        changeColorTheme();
                    }
                } else {
                    if (resp.hasOwnProperty("cacheDetails")) {
                        sessionStorage.setItem(`cachedDetails_visitor_${viewingUser}`, JSON.stringify(resp.cacheDetails));
                    } else {
                        sessionStorage.removeItem(`cachedDetails_visitor_${viewingUser}`);
                    }
                }

                return resp;

            }
        }
    }
}

//

// check if connected to internet

function checkConnection(aDom) {

    const offlineTxt = defaultTxt.noConnection;
    const onlineTxt = "Tilkoblet";

    if (aDom) {

        if (document.getElementById(aDom)) {

            const domElement = document.getElementById(aDom);

            if (!window.navigator.onLine) {
                domElement.textContent = offlineTxt;
                domElement.style.color = "red";
            } else if (window.navigator.onLine && domElement.textContent === offlineTxt) {
                domElement.textContent = onlineTxt;
                domElement.style.color = "green";

                setInterval(() => {
                    location.reload();
                }, 2500);
            }
        }

    }

}

//

//

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//

function useHTTPS() {
    if (location.protocol !== 'https:' && !location.href.includes("localhost")) {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
        console.log("changed to https");
    }
}

//

async function sortByLiftsOrGoalOwner(aDom, aType) {

    const dom = document.getElementById(aDom);
    const type = aType;
    let domValue = null;

    if (dom && type) {

        if (!dom.value || dom.value === "null") {
            domValue = null;
        } else {
            domValue = dom.value;
        }

        if (type === "lift") {
            showLiftBadgeAnimations = true;
            sessionStorage.removeItem("badgeslifts_scroll_x");
            user.changeSetting("lifts_filter_exercise", domValue);
            if (navigator.onLine) {
                const value = domValue;
                const setting = "lifts_filter_exercise";

                const infoHeader = { "updateSetting": setting, "value": value };
                const url = `/user/update/settings/${setting}`;

                await callServerAPIPost(infoHeader, url);
            }

            displayLifts();
        }

        if (type === "goal") {
            showGoalBadgeAnimations = true;
            sessionStorage.removeItem("badgesgoals_scroll_x");
            user.changeSetting("goals_filter_exercise", domValue);
            if (navigator.onLine) {
                const value = domValue;
                const setting = "goals_filter_exercise";

                const infoHeader = { "updateSetting": setting, "value": value };
                const url = `/user/update/settings/${setting}`;

                await callServerAPIPost(infoHeader, url);
            }

            displayGoals();
        }
    }
}

function sortByLiftsOrGoalVisitor(aDom, aType) {

    const dom = document.getElementById(aDom);
    const type = aType;

    if (dom && type) {

        if (type === "lift") {
            sessionStorage.setItem('lifts_filter_exercise_visitor', dom.value);
            displayLifts();
        }

        if (type === "goal") {
            sessionStorage.setItem('goals_filter_exercise_visitor', dom.value);
            displayGoals();
        }
    }
}

//

//

function getDaysSinceAndDate(aDate) {
    let daysSinceMsg = "";
    let fixedDate = "";
    const dateArr = aDate.split("-");
    if (dateArr.length === 3) {

        if (dateArr[0].length === 4 && dateArr[1] > 0 && dateArr[1] <= 12 && dateArr[1].length <= 2 && dateArr[2] > 0 && dateArr[2] <= 31 && dateArr[2].length <= 2) {

            const d = new Date();
            const date = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2]);

            fixedDate = getDateFormat(dateArr[2], dateArr[1], dateArr[0]);

            const daysSinceTime = parseInt((d - date) / (1000 * 3600 * 24));

            if (d < date) {
                //fremtiden
            } else if (daysSinceTime > 1) {
                daysSinceMsg = `${parseInt(daysSinceTime)} dager siden`;
            } else if (daysSinceTime === 1) {
                daysSinceMsg = `I går`;
            } else if (daysSinceTime === 0) {
                daysSinceMsg = `I dag`;
            }
        }
    }

    return { "daysSinceMsg": daysSinceMsg, "fixedDate": fixedDate };
}

//

function updateApplication(aShowNotification) {
    if (window.navigator.onLine) {
        let confirmUpdate = true;

        sessionStorage.removeItem('settings_notification_update');

        if (aShowNotification !== false) {
            //confirmUpdate = confirm("Ønsker du å oppdatere? (Krever Internett-tilkobling)");
            showConfirm("Ønsker du å oppdatere? (Krever Internett-tilkobling)", "deleteAllCaches();");
            return;
        }

        if (confirmUpdate === true) {
            deleteAllCaches();
        }
    } else {
        if (aShowNotification !== false) {
            //alert("Kunne ikke oppdatere! Krever Internett-tilkobling");
            showAlert("Kunne ikke oppdatere! Krever Internett-tilkobling", true);
        }
    }
}

function deleteCachesConfirm() {
    /*const confirmDeleteCache = confirm("Er du sikker på at du ønsker å tømme caches (Offline modus vil være utilgjengelig frem til ny cache blir lastet ned)");

    if (confirmDeleteCache === true) {
        removeServiceWorker();
        deleteAllCaches();
    }*/

    showConfirm("Er du sikker på at du ønsker å tømme caches (Offline modus vil være utilgjengelig frem til ny cache blir lastet ned)", "deleteAllCaches();");
}

function removeServiceWorker() {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
        location.reload();
    });
}

async function deleteAllCaches() {
    const cachesKeys = await caches.keys();
    for (let i = 0; i < cachesKeys.length; i++) {
        await caches.delete(cachesKeys[i]);
    }
    removeServiceWorker();
}

// redirect functions

function redirectToLogin() {

    location.href = "/login.html";

}

function redirectToFeed() {

    location.href = "index.html";

}

function redirectToLeaderboards() {

    location.href = "leaderboards.html";

}

function redirectToUsers() {

    location.href = "users.html";

}

function redirectToUser(viewUser) {

    const viewingUser = viewUser;

    if (viewingUser) {
        if (user && user.getId() === parseInt(viewingUser)) {
            redirectToAccount();
        } else {
            sessionStorage.setItem("visit_user_referrer", document.URL);
            location.href = `user.html?user_id=${viewingUser}`;
        }
    } else {
        redirectToFeed();
    }
}

function redirectToAccount() {

    location.href = "account.html";

}

function redirectToSettings() {

    sessionStorage.removeItem("currentSetting");
    location.href = "settings.html";

}

//