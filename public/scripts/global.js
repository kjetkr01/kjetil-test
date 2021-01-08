// global variables

const token = localStorage.getItem("authToken");
const user = localStorage.getItem("user");
let userDisplayname, showGymCloseTime;

let lastUpdatedTime = new Date();
lastUpdatedTime = lastUpdatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//

// fixed global variables

if (user) {
    try {

        userDisplayname = JSON.parse(user);
        showGymCloseTime = userDisplayname.showGymCloseTime;
        userDisplayname = userDisplayname.displayname;

    } catch (err) {

        console.log("invalid user object");

    }
}

//

// check if token / user exists

if (token) {
    console.log("Token: " + token)
} else {
    console.log("No token!");
}

if (user) {
    console.log("Logged in as: " + userDisplayname)
} else {
    console.log("Not logged in!");
}

//


//auto redirect to login if token is invalid
window.onload = validateToken;
async function validateToken() {

    if (!window.navigator.onLine) {
        console.log("Offline mode is enabled, server fetching is disabled!");
        return;
    }

    const currentPage = window.location.pathname;

    //blacklists login pages
    if (currentPage === "/test-login.html" || currentPage === "/login.html") {

        console.log("blacklisted page, skipped");
        return;

    } else {

        /*
        token = localStorage.getItem("authToken");
        user = localStorage.getItem("user");
        userDisplayname = JSON.parse(user);
        userDisplayname = userDisplayname.displayname;
        */

        if (token && user) {

            const body = { "authToken": token, "userInfo": user };
            const url = `/validate`;

            const resp = await callServerAPI(body, url);

            if (resp === "Ok") {
                console.log("Token is valid");
            } else {
                console.log("invalid token");
                localStorage.clear();
                sessionStorage.clear();
                //redirectToLogin();
            }

        } else {
            console.log("no token/user, skipped");
            //redirectToLogin();
        }
    }
}

async function callServerAPI(body, url) {

    if (!window.navigator.onLine) {
        console.log("Offline mode is enabled, server fetching is disabled!");
        return;
    }

    if (!body || !url) {
        return;
    }

    const config = {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(url, config);
    const data = await response.json();
    //console.log(response.status);

    //return { "response": response, "data": data };
    return data;

}

// redirect functions

function redirectToLogin() {

    location.href = "/login.html";

}

function redirectToHome() {

    location.href = "test.html";

}

function redirectToUsers() {

    location.href = "test-users.html";

}

function redirectToUser() {

    location.href = "test-user.html";

}

function redirectToSettings() {

    location.href = 'test-settings.html';

}

function redirectToAccount() {

    location.href = "test-account.html";

}


//