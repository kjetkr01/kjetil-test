"use strict";

// creates user class
function createUserClass() {

    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const userObj = localStorage.getItem("user") || sessionStorage.getItem("user");
    const detailsObj = localStorage.getItem("userDetails") || sessionStorage.getItem("userDetails");
    const settingsObj = localStorage.getItem("userSettings") || sessionStorage.getItem("userSettings");

    if (token && userObj && settingsObj) {
        try {

            user = new TUser(token, JSON.parse(userObj), JSON.parse(detailsObj), JSON.parse(settingsObj));

        } catch (err) {
            userError();
        }

    } else {
        userError();
    }
}
// End of createUserClass function

// Displays error if could not create user class. Then redirects to login
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
// End of userError function

// User class (for logged in user)
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
// End of TUser class