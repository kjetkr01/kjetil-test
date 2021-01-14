// global variables

const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");// eller session
const user = localStorage.getItem("user") || sessionStorage.getItem("user"); // eller session
let userDisplayname, showGymCloseTime;

let lastUpdatedTime = new Date();
lastUpdatedTime = lastUpdatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const errorText = "Det har oppstått en feil!";
const loadingText = "Laster...";
const errorLoadingText = "Kunne ikke laste inn innholdet.";

const activeColor = "rgb(0, 255, 170)";

//

// fixed global variables

if (user) {
    try {

        userDisplayname = JSON.parse(user);
        showGymCloseTime = userDisplayname.showGymCloseTime;
        userDisplayname = userDisplayname.displayname;

        console.log(123)

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

    if (response.status === 200 || data.includes("opptatt") || data.includes("privat")) {
        return data;
    } else {
        console.log("not returning data, recieved status:" + response.status)
    }

    //return { "response": response, "data": data };

}

// show different links based if user is logged in or not

let currentdID = "";
let savedWidth = window.innerWidth;

/*window.addEventListener("resize", function () {
    console.log("Updated page, resize")
    displayLinks(currentdID);
});*/

setInterval(() => {
    if (savedWidth !== window.innerWidth) {
        console.log("Updated page, resize");
        displayLinks(currentdID);
    }
}, 100);

function displayLinks(dID) {

    if (dID) {

        const documentID = document.getElementById(dID);

        if (documentID) {

            savedWidth = window.innerWidth;

            currentdID = dID;

            let htmlInfo = "";

            const homeURL = "index.html", homeName = "Hjem";
            const leaderboardsURL = "leaderboards.html", leaderboardsName = "Ledertavler";
            const accountURL = "account.html", accountName = "Min Konto";

            const accessURL = "access.html", accessName = "Be om tilgang";
            const loginURL = "login.html", loginName = "Logg inn";

            const currentPageURL = window.location.href;
            const getCurrentPage = currentPageURL.split("/").pop();

            const footermenu = document.getElementById("footermenu");

            console.log("Current Page:" + getCurrentPage);

            if (token && user) {

                if (window.innerWidth < 769) {

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
                            <a href=${homeURL}><img class="footerIcons" src="images/homeIcon.svg" draggable="false" alt="${homeName}"></a>
                            <a href=${leaderboardsURL} style="margin-right:24vw; margin-left:24vw;"><img class="footerIcons" src="images/leaderboardsIcon.svg" draggable="false" alt="${leaderboardsName}"></a>
                            <a href=${accountURL}><img class="footerIcons" src="images/accountIcon.svg" draggable="false" alt="${accountName}"></a>
                            `;

                        footermenu.innerHTML = document.title;

                        documentID.innerHTML = htmlInfo;
                    }


                } else {

                    footermenu.innerHTML = "";

                    switch (getCurrentPage) {
                        case homeURL:
                            htmlInfo = `
                            <a href=${homeURL} draggable="false" style="margin-left:5px; margin-right:3.5vw; color:${activeColor};">${homeName}</a>
                            <a href=${leaderboardsURL} draggable="false">${leaderboardsName}</a>
                            <a href=${accountURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                        case leaderboardsURL:
                            htmlInfo = `
                            <a href=${homeURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL} draggable="false" style="color:${activeColor};">${leaderboardsName}</a>
                            <a href=${accountURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                        case accountURL:
                            htmlInfo = `
                            <a href=${homeURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL} draggable="false">${leaderboardsName}</a>
                            <a href=${accountURL} draggable="false" style="margin-left:3.5vw; margin-right:5px; color:${activeColor};">${accountName}</a>
                            `;
                            break;
                        default:
                            htmlInfo = `
                            <a href=${homeURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL} draggable="false">${leaderboardsName}</a>
                            <a href=${accountURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                    }

                    documentID.innerHTML = htmlInfo;

                }

            } else {

                if (getCurrentPage) {
                    
                    /*
                    switch (getCurrentPage) {
                        case accessURL:
                            htmlInfo = `
                                <a href=${accessURL} draggable="false" style="margin-left:5px; margin-right:3.5vw; color:${activeColor};">${accessName}</a>
                                <a href=${loginURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${loginName}</a>
                                `;
                            break;
                        case loginURL:
                            htmlInfo = `
                                <a href=${accessURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${accessName}</a>
                                <a href=${loginURL} draggable="false" style="margin-left:3.5vw; margin-right:5px; color:${activeColor};">${loginName}</a>
                                `;
                            break;
                        default:
                            htmlInfo = `
                                <a href=${accessURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${accessName}</a>
                                <a href=${loginURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${loginName}</a>
                                `;
                            break;
                    }
                    */

                    if (window.innerWidth < 769) {
                        footermenu.innerHTML = document.title;
                    } else {
                        footermenu.innerHTML = "";
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

function redirectToLeaderboards() {

    location.href = "leaderboards.html";

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