// global variables

const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
const user = localStorage.getItem("user") || sessionStorage.getItem("user");
let userDisplayname, showGymCloseTime, username, userID;
let isUpdatingUserObject = false;
let preferredColorTheme = null;
let lockedBody = false;

let lastUpdatedTime = new Date();
lastUpdatedTime = lastUpdatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const errorText = "Det har oppstått en feil!";
const loadingText = "Laster...";
const errorLoadingText = "Kunne ikke laste inn innholdet.";

//const allowedThemes = ["default", "blue"];

const allowedThemes = {
    0: { "id": 0, "name": "Standard", "theme": "default" },
    1: { "id": 1, "name": "Blå", "theme": "blue" }
}

const badgeColorBorders = {
    "redBadgeG": `972F2F`,
    "yellowBadgeG": `C96E4C`,
    "blueBadgeG": `2B2379`,

    "redBadge": `E36262`,
    "yellowBadge": `DBB331`,
    "blueBadge": `626BE3`,
}

const themeKeys = Object.keys(allowedThemes);
const checkAllowedThemes = [];
for (let i = 0; i < themeKeys.length; i++) {
    checkAllowedThemes.push(allowedThemes[themeKeys[i]].theme);
}

//

// update global user variables

if (user) {
    try {

        userDisplayname = JSON.parse(user);

        username = userDisplayname.username;
        userID = userDisplayname.id;

        preferredColorTheme = allowedThemes[userDisplayname.preferredColorTheme].theme;

        if (preferredColorTheme !== sessionStorage.getItem("colorTheme") && checkAllowedThemes.includes(preferredColorTheme) === true) {
            if (localStorage.getItem("user")) {
                localStorage.setItem("colorTheme", preferredColorTheme);
            } else {
                sessionStorage.setItem("colorTheme", preferredColorTheme);
            }
        }

        userDisplayname = userDisplayname.displayname;

    } catch (err) {

        console.log("invalid user object");
        console.log("ERROR:");
        console.log("------------------------------------");
        console.log(err);
        console.log("------------------------------------");

    }
}

// changeColorTheme

function changeColorTheme() {

    let colorTheme = allowedThemes[0].theme;
    const preferredTheme = localStorage.getItem("colorTheme") || sessionStorage.getItem("colorTheme") || colorTheme;

    if (checkAllowedThemes.includes(preferredTheme) === true) {
        colorTheme = preferredTheme;
    }

    // heller bruke feks colorThemeBlue, light/dark eller auto = ingen

    if (colorTheme !== sessionStorage.getItem("colorTheme")) {
        //sessionStorage.setItem("colorTheme", colorTheme);

        if (localStorage.getItem("user")) {
            localStorage.setItem("colorTheme", colorTheme);
        } else {
            sessionStorage.setItem("colorTheme", colorTheme);
        }
    }

    const theme = localStorage.getItem("theme") || sessionStorage.getItem("theme") || "0";

    if (theme === "1") {
        document.body.classList = `${colorTheme}ColorTheme-light lightMode`; // evt legge til if preferred apperance = light, dark. Hvis auto bare ""colorTheme
    } else if (theme === "2") {
        document.body.classList = `${colorTheme}ColorTheme-dark darkMode`; // evt legge til if preferred apperance = light, dark. Hvis auto bare ""colorTheme
    } else {
        //document.body.classList = `${colorTheme}ColorTheme`; // evt legge til if preferred apperance = light, dark. Hvis auto bare ""colorTheme

        //window.matchMedia('(prefers-color-scheme: dark)').removeEventListener("change", test);
        //window.matchMedia('(prefers-color-scheme: light)').removeEventListener("change", test);

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // dark mode

            //window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', test);

            document.body.classList = `${colorTheme}ColorTheme-dark darkMode`;
        } else {
            // light mode
            //window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', test);

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
    const theme = localStorage.getItem("theme") || sessionStorage.getItem("theme") || "0";

    if (theme === "0") {
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
        sessionStorage.setItem("ViewingUser", viewUser);
        redirectToUser();
    }
}

//

//auto redirect to login if token is invalid
window.onload = validateToken;
async function validateToken() {

    if (!window.navigator.onLine) {
        return;
    }

    const currentPage = window.location.pathname;

    const blackListedPages = ["/access.html", "/login.html"];

    //blacklists login pages
    if (blackListedPages.includes(currentPage)) {

        console.log(`"${currentPage}" is a blacklisted page, skipped token verification`);
        return;

    } else {

        if (token && user) {

            const body = { "authToken": token, "userInfo": user };
            const url = `/validate`;

            const resp = await callServerAPI(body, url);

            if (resp) {

            } else {
                localStorage.clear();
                sessionStorage.clear();
                sessionStorage.setItem("cachedUsername", username);
                redirectToLogin();
            }

        } else {
            redirectToLogin();
        }
    }
}

async function callServerAPI(body, url) {

    if (!window.navigator.onLine) {
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

/*
setInterval(() => {
    if (savedWidth !== window.innerWidth) {
        displayLinks(currentdID);
    }
}, 100);*/
/*
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
                            <a href=${homeURL} draggable="false" class="activeColor" style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL} draggable="false">${leaderboardsName}</a>
                            <a href=${accountURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                        case leaderboardsURL:
                            htmlInfo = `
                            <a href=${homeURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL} draggable="false" class="activeColor">${leaderboardsName}</a>
                            <a href=${accountURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
                            `;
                            break;
                        case accountURL:
                            htmlInfo = `
                            <a href=${homeURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${homeName}</a>
                            <a href=${leaderboardsURL} draggable="false">${leaderboardsName}</a>
                            <a href=${accountURL} draggable="false" class="activeColor" style="margin-left:3.5vw; margin-right:5px;">${accountName}</a>
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
 
                    
                    switch (getCurrentPage) {
                        case accessURL:
                            htmlInfo = `
                                <a href=${accessURL} draggable="false" class="activeColor" style="margin-left:5px; margin-right:3.5vw;">${accessName}</a>
                                <a href=${loginURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${loginName}</a>
                                `;
                            break;
                        case loginURL:
                            htmlInfo = `
                                <a href=${accessURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${accessName}</a>
                                <a href=${loginURL} draggable="false" class="activeColor" style="margin-left:3.5vw; margin-right:5px;">${loginName}</a>
                                `;
                            break;
                        default:
                            htmlInfo = `
                                <a href=${accessURL} draggable="false" style="margin-left:5px; margin-right:3.5vw;">${accessName}</a>
                                <a href=${loginURL} draggable="false" style="margin-left:3.5vw; margin-right:5px;">${loginName}</a>
                                `;
                            break;
                    }
                    
 
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
*/
//

// check color theme
/*
function checkColorTheme() {
    if (user) {
 
        const intervalCheck = setInterval(() => {
 
            if (isUpdatingUserObject === false) {
                if (preferredColorTheme) {
                    if (preferredColorTheme === "light" || preferredColorTheme === "dark") {
                        document.body.className = preferredColorTheme;
                        clearInterval(intervalCheck);
                    } else {
                        document.body.className = "";
                        clearInterval(intervalCheck);
                    }
                }
            } else {
                console.log("waiting for update");
            }
        }, 100);
    }
}
*/
//

// get new updated user object
/*
async function getUpdatedUserObject(returnInfo, myUsername) {
 
    if (token && user && myUsername) {
 
        isUpdatingUserObject = true;
 
        const body = { "authToken": token, "userInfo": user, "viewingUser": myUsername };
        const url = `/user/details/settingsInfo`;
 
        const resp = await callServerAPI(body, url);
 
        if (resp.settings && resp.userInfo) {
 
            if (localStorage.getItem("user")) {
                localStorage.setItem("user", JSON.stringify(resp.userInfo));
            } else {
                sessionStorage.setItem("user", JSON.stringify(resp.userInfo));
            }
 
            checkColorTheme();
 
            const today = new Date();
            const updatedTxt = today.toLocaleDateString() || true;
            sessionStorage.setItem("updated", updatedTxt);
 
            preferredColorTheme = resp.userInfo.preferredColorTheme;
            isUpdatingUserObject = false;
 
            if (returnInfo === true) {
                return resp;
            }
 
        } else {
            isUpdatingUserObject = false;
            alert("Feil, prøv igjen");
            redirectToHome();
        }
    }
}
*/
//

// get user/owner information
async function getAccountDetails(aUserID) {

    if (token && user && aUserID) {

        isUpdatingUserObject = true;

        const viewingUser = aUserID;

        const body = { "authToken": token, "userInfo": user, "viewingUser": viewingUser };
        const url = `/users/details/${viewingUser}`;

        const resp = await callServerAPI(body, url);

        isUpdatingUserObject = false;

        if (resp) {

            if (resp.hasOwnProperty("updatedUserObject")) {
                if (localStorage.getItem("user")) {
                    localStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                } else {
                    sessionStorage.setItem("user", JSON.stringify(resp.updatedUserObject));
                }

                const newColorTheme = allowedThemes[resp.updatedUserObject.preferredColorTheme].theme;

                if (preferredColorTheme !== newColorTheme && checkAllowedThemes.includes(newColorTheme) === true) {
                    preferredColorTheme = newColorTheme;

                    if (localStorage.getItem("user")) {
                        localStorage.setItem("colorTheme", newColorTheme);
                    } else {
                        sessionStorage.setItem("colorTheme", newColorTheme);
                    }

                    changeColorTheme();
                }

                const newTheme = resp.updatedUserObject.preferredTheme;

                if (newTheme === "0" || newTheme === "1" || newTheme === "2") {
                    //localStorage.setItem("theme", newTheme);

                    if (localStorage.getItem("user")) {
                        localStorage.setItem("theme", newTheme);
                    } else {
                        sessionStorage.setItem("theme", newTheme);
                    }

                    changeColorTheme();
                }
            }

            return resp;

        } else {

            if (userID === viewingUser) {
                sessionStorage.clear();
                localStorage.clear();
                alert("Det har oppstått en feil. Du blir nå logget ut. Vennligst logg inn på nytt");
                location.reload();
            }
        }
    }

    //alert("Feil, prøv igjen");
    //redirectToFeed();
}

//

// check if connected to wifi

function checkConnection(aDom) {

    const offlineTxt = "Ingen internettforbindelse";
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
            else {
                domElement.textContent = "";
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

function sortByLifts(aDom) {

    const dom = document.getElementById(aDom);

    if (dom) {
        if (allowedExercises.includes(dom.value)) {
            sessionStorage.setItem('display_lifts', dom.value);
        } else {
            sessionStorage.removeItem('display_lifts');
        }
    }

    location.reload();
}

//

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

function redirectToUser() {

    const viewingUser = sessionStorage.getItem("ViewingUser");

    if (viewingUser) {
        if (userID === parseInt(viewingUser)) {
            redirectToAccount();
        } else {
            location.href = "user.html";
        }
    } else {
        location.href = "user.html";
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