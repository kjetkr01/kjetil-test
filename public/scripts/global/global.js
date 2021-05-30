// global variables

let user = null, lockedBody = false;

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
    2: { "id": 2, "name": "Test (Full)", "theme": "test_full" },
    3: { "id": 3, "name": "Test 2 (Full)", "theme": "test2_full" }
}

const themeColors = {
    "default": { "lightHex": "327a94", "darkHex": "1c4553" },
    "blue": { "lightHex": "3247bb", "darkHex": "202b6b" },
    "test_full": { "lightHex": "166ba0", "darkHex": "09314b" },
    "test2_full": { "lightHex": "e6e6e6", "darkHex": "09314b" }
}

const allowedExercises = ["benkpress", "markløft", "knebøy", "skulderpress"];

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
    const settingsObj = localStorage.getItem("userSettings") || sessionStorage.getItem("userSettings");

    if (token && userObj && settingsObj) {
        try {

            user = new TUser(token, JSON.parse(userObj), JSON.parse(settingsObj));

            // redirects to login if token is invalid
            validateToken();
            async function validateToken() {

                if (!window.navigator.onLine) {
                    return;
                }

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

                        if (resp) {

                        } else {
                            localStorage.clear();
                            sessionStorage.clear();
                            sessionStorage.setItem("cachedUsername", user.getUsername());
                            redirectToLogin();
                        }

                    } else {
                        redirectToLogin();
                    }
                }
            }

        } catch (err) {

            console.log("ERROR:");
            console.log("------------------------------------");
            console.log(err);
            console.log("------------------------------------");

        }
    } else {
        localStorage.clear();
        sessionStorage.clear();
        redirectToLogin();
    }
}


// User class (for logged inn user)
function TUser(aToken, aUser, aSettings) {

    const token = aToken;

    const user = {
        "id": aUser.id,
        "displayname": aUser.displayname,
        "username": aUser.username
    }

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

                    const s = resp.info.settings;

                    if (localStorage.getItem("user")) {
                        localStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                        localStorage.setItem("userSettings", JSON.stringify(s));
                    } else {
                        sessionStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                        sessionStorage.setItem("userSettings", JSON.stringify(s));
                    }

                    if (resp.hasOwnProperty("cacheDetails")) {
                        localStorage.setItem("cachedDetails_owner", JSON.stringify(resp.cacheDetails));
                    } else {
                        localStorage.removeItem("cachedDetails_owner");
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

                    if (s.hasOwnProperty("leaderboards_filter_reps")) {
                        if (s.leaderboards_filter_reps) {
                            localStorage.setItem("leaderboards_filter_reps", s.leaderboards_filter_reps);
                        } else {
                            localStorage.removeItem("leaderboards_filter_reps");
                        }
                    }
                    if (s.hasOwnProperty("display_lifts_owner")) {
                        if (s.display_lifts_owner) {
                            if (localStorage.getItem("display_lifts_owner") !== s.display_lifts_owner) {
                                localStorage.setItem("display_lifts_owner", s.display_lifts_owner);
                            }
                        } else {
                            localStorage.removeItem("display_lifts_owner");
                        }
                    }
                    if (s.hasOwnProperty("display_goals_owner")) {
                        if (s.display_goals_owner) {
                            if (localStorage.getItem("display_goals_owner") !== s.display_goals_owner) {
                                localStorage.setItem("display_goals_owner", s.display_goals_owner);
                            }
                        } else {
                            localStorage.removeItem("display_goals_owner");
                        }
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

//

async function sortByLiftsOrGoalOwner(aDom, aType) {

    const dom = document.getElementById(aDom);
    const type = aType;

    if (dom && type) {

        if (type === "lift") {
            showLiftBadgeAnimations = true;
            sessionStorage.removeItem("badgeslifts_scroll_x");
            if (allowedExercises.includes(dom.value)) {
                localStorage.setItem('display_lifts_owner', dom.value);
                if (navigator.onLine) {
                    const value = dom.value;
                    const setting = "display_lifts_owner";

                    const infoHeader = { "updateSetting": setting, "value": value };
                    const url = `/user/update/settings/${setting}`;

                    await callServerAPIPost(infoHeader, url);
                }
            } else {
                localStorage.removeItem('display_lifts_owner');
                if (navigator.onLine) {
                    const value = null;
                    const setting = "display_lifts_owner";

                    const infoHeader = { "updateSetting": setting, "value": value };
                    const url = `/user/update/settings/${setting}`;

                    await callServerAPIPost(infoHeader, url);
                }
            }

            displayLifts();
        }

        if (type === "goal") {
            showGoalBadgeAnimations = true;
            sessionStorage.removeItem("badgesgoals_scroll_x");
            if (allowedExercises.includes(dom.value)) {
                localStorage.setItem('display_goals_owner', dom.value);
                if (navigator.onLine) {
                    const value = dom.value;
                    const setting = "display_goals_owner";

                    const infoHeader = { "updateSetting": setting, "value": value };
                    const url = `/user/update/settings/${setting}`;

                    await callServerAPIPost(infoHeader, url);
                }
            } else {
                localStorage.removeItem('display_goals_owner');
                if (navigator.onLine) {
                    const value = null;
                    const setting = "display_goals_owner";

                    const infoHeader = { "updateSetting": setting, "value": value };
                    const url = `/user/update/settings/${setting}`;

                    await callServerAPIPost(infoHeader, url);
                }
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
            if (allowedExercises.includes(dom.value)) {
                sessionStorage.setItem('display_lifts_visitor', dom.value);
            } else {
                sessionStorage.removeItem('display_lifts_visitor');
            }

            displayLifts();
        }

        if (type === "goal") {
            if (allowedExercises.includes(dom.value)) {
                sessionStorage.setItem('display_goals_visitor', dom.value);
            } else {
                sessionStorage.removeItem('display_goals_visitor');
            }

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

        if (aShowNotification !== false) {
            confirmUpdate = confirm("Ønsker du å oppdatere? (Krever Internett-tilkobling)");
        }

        if (confirmUpdate === true) {
            sessionStorage.removeItem("settings_notification_update");
            removeServiceWorker();
            deleteAllCaches();
        }
    } else {
        if (aShowNotification !== false) {
            alert("Kunne ikke oppdatere! Krever Internett-tilkobling");
        }
    }
}

function deleteCachesAndUnregisterSW() {
    const confirmDeleteCache = confirm("Er du sikker på at du ønsker å tømme caches (Offline modus vil være utilgjengelig frem til ny cache blir lastet ned)");

    if (confirmDeleteCache === true) {
        removeServiceWorker();
        deleteAllCaches();
    }
}

function removeServiceWorker() {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

function updateServiceWorker() {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.update();
        }
    });
}

async function deleteAllCaches() {
    const cachesKeys = await caches.keys();
    for (let i = 0; i < cachesKeys.length; i++) {
        await caches.delete(cachesKeys[i]);
    }
    location.reload();
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
            //sessionStorage.removeItem('display_goals_visitor');
            //sessionStorage.removeItem('display_lifts_visitor');
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