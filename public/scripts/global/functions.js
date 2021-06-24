"use strict";

// changes color theme based on user preferences
function changeColorTheme() {

    const defaultValues = allowedColorThemes[Object.keys(allowedColorThemes)[0]];
    let colorTheme = defaultValues.theme;
    let themeColor = defaultValues;
    let theme = 0;

    if (user) {
        if (allowedColorThemes[user.getSetting("preferredcolortheme")]) {
            const preferredTheme = allowedColorThemes[user.getSetting("preferredcolortheme")];
            colorTheme = preferredTheme.theme;
            themeColor = preferredTheme;
        }
        theme = user.getSetting("preferredtheme");
    }

    const themeColorDOM = document.getElementById("themeColor");

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
}
// End of changeColorTheme function

// checks if allowed scheme
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
// End of checkIfAllowedScheme function

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkIfAllowedScheme);

// calls server api post if connected to internet
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
    } else if (data.includes("invalid token")) {
        userError();
    } else {
        console.log("not returning data, recieved status:" + response.status)
    }
}
// End of callServerAPIPost function


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

                    let saveInLocalStorage = false;

                    if (localStorage.getItem("user")) {
                        saveInLocalStorage = true;
                        localStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                        localStorage.setItem("userDetails", JSON.stringify(resp.userDetails));
                        localStorage.setItem("userSettings", JSON.stringify(resp.info.settings));
                    } else {
                        sessionStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                        sessionStorage.setItem("userDetails", JSON.stringify(resp.userDetails));
                        sessionStorage.setItem("userSettings", JSON.stringify(resp.info.settings));
                    }

                    if (resp.info.hasOwnProperty("activetrainingsplit")) {
                        if (saveInLocalStorage === true) {
                            localStorage.setItem("cachedActiveTrainingsplit_owner", JSON.stringify(resp.info.activetrainingsplit));
                        } else {
                            sessionStorage.setItem("cachedActiveTrainingsplit_owner", JSON.stringify(resp.info.activetrainingsplit));
                        }
                    } else {
                        localStorage.removeItem("cachedActiveTrainingsplit_owner");
                        sessionStorage.removeItem("cachedActiveTrainingsplit_owner");
                    }

                    if (resp.info.hasOwnProperty("alltrainingsplits")) {
                        if (saveInLocalStorage === true) {
                            localStorage.setItem("cachedAllTrainingsplits_owner", JSON.stringify(resp.info.alltrainingsplits));
                        } else {
                            sessionStorage.setItem("cachedAllTrainingsplits_owner", JSON.stringify(resp.info.alltrainingsplits));
                        }
                    } else {
                        localStorage.removeItem("cachedAllTrainingsplits_owner");
                        sessionStorage.removeItem("cachedAllTrainingsplits_owner");
                    }

                    if (resp.info.hasOwnProperty("allowedLifts")) {
                        allowedLifts = resp.info.allowedLifts;
                        if (saveInLocalStorage === true) {
                            localStorage.setItem("allowedLifts", JSON.stringify(allowedLifts));
                        } else {
                            sessionStorage.setItem("allowedLifts", JSON.stringify(allowedLifts));
                        }
                    }

                    if (resp.info.hasOwnProperty("allowedGoals")) {
                        allowedGoals = resp.info.allowedGoals;
                        if (saveInLocalStorage === true) {
                            localStorage.setItem("allowedGoals", JSON.stringify(allowedGoals));
                        } else {
                            sessionStorage.setItem("allowedGoals", JSON.stringify(allowedGoals));
                        }
                    }

                    let updatedThemeValues = false;

                    const newColorTheme = resp.info.settings.preferredcolortheme;

                    if (user.getSetting("preferredcolortheme") !== newColorTheme && allowedColorThemes[newColorTheme]) {
                        user.changeSetting("preferredcolortheme", newColorTheme);
                        updatedThemeValues = true;
                    }

                    const newTheme = resp.info.settings.preferredtheme;

                    if (user.getSetting("preferredtheme") !== newTheme) {
                        user.changeSetting("preferredtheme", newTheme);
                        updatedThemeValues = true;
                    }

                    if (updatedThemeValues === true) {
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
// End of getAccountDetails function

// check if connected to internet. If not connected, displays small text in footer
function checkConnection() {

    const offlineTxt = defaultTxt.noConnection;
    const onlineTxt = "Tilkoblet";

    const dom = document.getElementById("footerInfo");

    if (dom) {

        if (!window.navigator.onLine) {
            dom.style.display = "block";
            dom.textContent = offlineTxt;
            dom.style.color = "red";
        } else if (window.navigator.onLine && dom.textContent === offlineTxt) {
            dom.style.display = "block";
            dom.textContent = onlineTxt;
            dom.style.color = "green";

            setInterval(() => {
                location.reload();
            }, 2500);
        } else {
            dom.style.display = "none";
        }
    }
}
// End of checkConnection function


// capitalizes first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// End of capitalizeFirstLetter function

// if user is not using https, then changes to https
function useHTTPS() {
    if (location.protocol !== 'https:' && location.href.includes("herokuapp")) {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
}
// End of useHTTPS function


// sortByLiftsOrGoalOwner
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
            displayLifts();
            if (navigator.onLine) {
                const value = domValue;
                const setting = "lifts_filter_exercise";

                const infoHeader = { "updateSetting": setting, "value": value };
                const url = `/user/update/settings/${setting}`;

                await callServerAPIPost(infoHeader, url);
            }
        }

        if (type === "goal") {
            showGoalBadgeAnimations = true;
            sessionStorage.removeItem("badgesgoals_scroll_x");
            user.changeSetting("goals_filter_exercise", domValue);
            displayGoals();
            if (navigator.onLine) {
                const value = domValue;
                const setting = "goals_filter_exercise";

                const infoHeader = { "updateSetting": setting, "value": value };
                const url = `/user/update/settings/${setting}`;

                await callServerAPIPost(infoHeader, url);
            }
        }
    }
}
// End of sortByLiftsOrGoalOwner function

// sortByLiftsOrGoalVisitor
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
// End of sortByLiftsOrGoalVisitor function

// gets days since date
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
// End of getDaysSinceAndDate function

// tries to create local date string
function getDateFormat(aDay, aMonth, aYear) {

    const day = aDay;
    const month = aMonth;
    const year = aYear;

    let string = "Ugyldig dato";

    if (day && month && year) {
        if (day.length === 1 || day.length === 2 && month.length === 1 || month.length === 2 && year.length === 4) {

            string = new Date(`${year}-${month}-${day}`);
            if (isNaN(string)) {
                string = `${day}.${month}.${year}`;
            } else {
                string = new Date(`${year}-${month}-${day}`).toLocaleDateString();
            }
        }
    }
    return string;
}
// End of getDateFormat function

// updates "application" / deletes old caches if connected to internet
function updateApplication(aShowNotification) {
    if (window.navigator.onLine) {
        let confirmUpdate = true;

        sessionStorage.removeItem('settings_notification_update');

        if (aShowNotification !== false) {
            showConfirm("Ønsker du å oppdatere? (Krever Internett-tilkobling)", "deleteAllCaches();");
            return;
        }

        if (confirmUpdate === true) {
            deleteAllCaches();
        }
    } else {
        if (aShowNotification !== false) {
            showAlert("Kunne ikke oppdatere! Krever Internett-tilkobling", true);
        }
    }
}
// End of updateApplication function

// deleteCachesConfirm
function deleteCachesConfirm() {
    showConfirm("Er du sikker på at du ønsker å tømme caches (Offline modus vil være utilgjengelig frem til ny cache blir lastet ned)", "deleteAllCaches();");
}
// End of deleteCachesConfirm function

// removes all service workers and reloads page
function removeServiceWorker() {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
        location.reload();
    });
}
// End of removeServiceWorker function

// deletes all caches
async function deleteAllCaches() {
    const cachesKeys = await caches.keys();
    for (let i = 0; i < cachesKeys.length; i++) {
        await caches.delete(cachesKeys[i]);
    }
    removeServiceWorker();
}
// End of deleteAllCaches function

/// -------------------- Redirect functions -------------------- ///

function redirectToLogin() {
    location.href = "/login.html";
}

function redirectToFeed() {
    location.href = "index.html";
}

function redirectToExplore() {
    location.href = "explore.html";
}

function redirectToLeaderboards() {
    location.href = "leaderboards.html";
}

function redirectToTrainingsplits() {
    sessionStorage.removeItem("@scroll-Trainingsplits");
    sessionStorage.removeItem("cached_search_trainingsplits");
    location.href = "trainingsplits.html";
}

function redirectToUsers() {
    sessionStorage.removeItem("@scroll-Users");
    sessionStorage.removeItem("cached_search_users");
    location.href = "users.html";
}

function redirectToUser(viewUser) {
    const viewingUser = viewUser;

    if (viewingUser) {
        if (user && user.getId() === parseInt(viewingUser)) {
            redirectToAccount();
        } else {
            try {
                let history = JSON.parse(sessionStorage.getItem("visit_user_referrer"));
                if (history && history.length > 0) {
                    if (history[history.length - 1]) {
                        history.push(document.URL);
                        sessionStorage.setItem("visit_user_referrer", JSON.stringify(history));
                    }
                } else {
                    history = [];
                    history.push(document.URL)
                    sessionStorage.setItem("visit_user_referrer", JSON.stringify(history));
                }
            } catch {
                sessionStorage.removeItem("visit_user_referrer");
            }
            //sessionStorage.setItem("visit_user_referrer", document.URL);
            location.href = `user.html?user_id=${viewingUser}`;
        }
    } else {
        redirectToFeed();
    }
}

function redirectToTrainingsplit(aTrainingsplitID, aDay, aEdit) {
    const trainingsplit_id = aTrainingsplitID;
    const day = aDay;
    const edit = aEdit;

    let daySearch = `&day=${day}`;
    let editSearch = `&edit=${edit}`;

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    if (!days.includes(day)) {
        daySearch = "";
    }
    if (edit !== true) {
        editSearch = "";
    }

    if (trainingsplit_id) {
        try {
            let history = JSON.parse(sessionStorage.getItem("visit_trainingsplit_referrer"));
            if (history && history.length > 0) {
                if (history[history.length - 1]) {
                    history.push(document.URL);
                    sessionStorage.setItem("visit_trainingsplit_referrer", JSON.stringify(history));
                }
            } else {
                history = [];
                history.push(document.URL)
                sessionStorage.setItem("visit_trainingsplit_referrer", JSON.stringify(history));
            }
        } catch {
            sessionStorage.removeItem("visit_trainingsplit_referrer");
        }
        location.href = `trainingsplit.html?trainingsplit_id=${trainingsplit_id}${daySearch}${editSearch}`;
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

/// -------------------- End of redirect functions -------------------- ///