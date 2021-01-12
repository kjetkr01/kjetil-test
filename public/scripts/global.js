// global variables

const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");// eller session
const user = localStorage.getItem("user") || sessionStorage.getItem("user"); // eller session
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
    console.log("Token: " + token);
} else {
    console.log("No token!");
}

if (user) {
    console.log("Logged in as: " + userDisplayname);
} else {
    console.log("Not logged in!");
}

//


//auto redirect to login if token is invalid
window.onload = validateToken;
async function validateToken() {

    if (!window.navigator.onLine) {
        const offlineMsg = "Offline mode is enabled, server fetching is disabled!";
        alert(offlineMsg);
        console.log(offlineMsg);
        return;
    }

    const currentPage = window.location.pathname;

    //blacklists login pages
    if (currentPage === "/access.html" || currentPage === "/login.html") {

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
                redirectToLogin();
            }

        } else {
            console.log("no token/user, skipped");
            redirectToLogin();
        }
    }
}

async function callServerAPI(body, url) {

    if (!window.navigator.onLine) {
        const offlineMsg = "Offline mode is enabled, server fetching is disabled!";
        alert(offlineMsg);
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

let currentdID = "";

window.addEventListener("resize", function () {
    console.log("Updated page, resize")
    displayLinks(currentdID);
});

function displayLinks(dID) {

    if (dID) {

        const documentID = document.getElementById(dID);

        if (documentID) {

            currentdID = dID;

            const activeColor = "rgb(0, 255, 170)";

            let htmlInfo = "";

            const homeURL = "index.html", homeName = "Hjem";
            const leaderboardsURL = "leaderboards.html", leaderboardsName = "Ledertavler";
            const accountURL = "account.html", accountName = "Min Konto";

            const accessURL = "access.html", accessName = "Be om tilgang";
            const loginURL = "login.html", loginName = "Logg inn";

            const currentPageURL = window.location.href;
            const getCurrentPage = currentPageURL.split("/").pop();

            console.log("Current Page:" + getCurrentPage);

            if (token && user) {

                // start interval for sjekk?

                if (window.innerWidth < 768) {

                    let icon1Loaded = false;
                    let icon2Loaded = false;
                    let icon3Loaded = false;

                    const homeImg = new Image();
                    homeImg.src = "images/homeIcon.svg";

                    const leaderboardsImg = new Image();
                    leaderboardsImg.src = "images/leaderboardsIcon.svg";

                    const accountImg = new Image();
                    accountImg.src = "images/accountIcon.svg";

                    homeImg.onload = function () { icon1Loaded = true };
                    leaderboardsImg.onload = function () { icon2Loaded = true };
                    accountImg.onload = function () { icon3Loaded = true };

                    const checkIfImagesIsLoaded = setInterval(() => {
                        if (icon1Loaded === true && icon2Loaded === true && icon3Loaded === true) {
                            displayIcons();
                            clearInterval(checkIfImagesIsLoaded);
                        }
                    }, 100);

                    function displayIcons() {
                        htmlInfo = `
                            <a href=${homeURL} style="margin-left:5px; margin-right:10vw;"><img class="footerIcons" src="images/homeIcon.svg" alt="${homeName}"></a>
                            <a href=${leaderboardsURL} style="margin-left:5px; margin-right:10vw;"><img class="footerIcons" src="images/leaderboardsIcon.svg" alt="${leaderboardsName}"></a>
                            <a href=${accountURL} style="margin-left:5px; margin-right:10vw;"><img class="footerIcons" src="images/accountIcon.svg" alt="${accountName}"></a>
                            `;

                        documentID.innerHTML = htmlInfo;
                    }


                } else {

                    switch (getCurrentPage) {
                        case homeURL:
                            htmlInfo = `
                            <a href=${homeURL} style="margin-left:5px; margin-right:3.5vw; color:${activeColor};">${homeName}</a>
                            <a href=${leaderboardsURL}>${leaderboardsName}</a>
                            <a href=${accountURL} style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                        case leaderboardsURL:
                            htmlInfo = `
                            <a href=${homeURL} style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL} style="color:${activeColor};">${leaderboardsName}</a>
                            <a href=${accountURL} style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                        case accountURL:
                            htmlInfo = `
                            <a href=${homeURL} style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL}>${leaderboardsName}</a>
                            <a href=${accountURL} style="margin-left:3.5vw; margin-right:5px; color:${activeColor};">${accountName}</a>
                            `;
                            break;
                        default:
                            htmlInfo = `
                            <a href=${homeURL} style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL}>${leaderboardsName}</a>
                            <a href=${accountURL} style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                    }

                    documentID.innerHTML = htmlInfo;

                }

            } else {

                if (getCurrentPage) {

                    switch (getCurrentPage) {
                        case accessURL:
                            htmlInfo = `
                            <a href=${accessURL} style="margin-left:5px; margin-right:3.5vw; color:${activeColor};">${accessName}</a>
                            <a href=${loginURL} style="margin-left:3.5vw; margin-right:5px;">${loginName}</a>
                            `;
                            break;
                        case loginURL:
                            htmlInfo = `
                            <a href=${accessURL} style="margin-left:5px; margin-right:3.5vw;">${accessName}</a>
                            <a href=${loginURL} style="margin-left:3.5vw; margin-right:5px; color:${activeColor};">${loginName}</a>
                            `;
                            break;
                        default:
                            htmlInfo = `
                            <a href=${accessURL} style="margin-left:5px; margin-right:3.5vw;">${accessName}</a>
                            <a href=${loginURL} style="margin-left:3.5vw; margin-right:5px;">${loginName}</a>
                            `;
                            break;
                    }

                    documentID.innerHTML = htmlInfo;

                }
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

    location.href = "index.html";

}

function redirectToUsers() {

    location.href = "users.html";

}

function redirectToUser() {

    location.href = "user.html";

}

function redirectToSettings() {

    location.href = 'settings.html';

}

function redirectToAccount() {

    location.href = "account.html";

}


//