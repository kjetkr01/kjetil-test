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
        const offlineMsg = "Offline mode is enabled, server fetching is disabled!";
        alert(offlineMsg)
        console.log(offlineMsg);
        return;
    }

    const currentPage = window.location.pathname;

    //blacklists login pages
    if (currentPage === "/test-login.html" || currentPage === "/login.html") {

        console.log("blacklisted page, skipped");
        return;

    } else {

        if (token && user) {

            const body = { "authToken": token, "userInfo": user };
            const url = `/validate`;

            const resp = await callServerAPI(body, url);

            if (resp) {
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
        const offlineMsg = "Offline mode is enabled, server fetching is disabled!";
        alert(offlineMsg)
        console.log(offlineMsg);
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

    if (response.status === 200) {
        return data;
    } else {
        console.log("not returning data, recieved status:" + response.status)
    }

    //return { "response": response, "data": data };

}

// show different links based if user is logged in or not

function displayLinks(dID) {

    if (dID) {

        const documentID = document.getElementById(dID);

        if (documentID) {

            if (token && user) {
                documentID.innerHTML = `
            <a href="index.html" style="margin-left:5px; margin-right:2.5vw;">Hjem</a>
            <a href="leaderboards.html">Ledertavler</a>
            <a href="account.html" style="margin-left:2.5vw; margin-right:5px;">Min konto</a>
            `;
            } else {
                documentID.innerHTML = `
            <a href="access.html" style="margin-left:5px; margin-right:2.5vw;">Be om tilgang</a>
            <a href="login.html" style="margin-left:2.5vw; margin-right:5px;">Logg inn</a>
            `;
            }

        } else {
            console.log("error ID: " + dID + " does not exist!");
        }
    }

}

//

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