// global variables

const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
const user = localStorage.getItem("user") || sessionStorage.getItem("user");
let userDisplayname, showGymCloseTime, username;
let isUpdatingUserObject = false;

let lastUpdatedTime = new Date();
lastUpdatedTime = lastUpdatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const errorText = "Det har oppstått en feil!";
const loadingText = "Laster...";
const errorLoadingText = "Kunne ikke laste inn innholdet.";

//

// fixed global variables

if (user) {
    try {

        userDisplayname = JSON.parse(user);

        if (!sessionStorage.getItem("updated")) {
            console.log("updating user object");
            getUpdatedUserObject(false, userDisplayname.username);
            hasUpdatedInfo = true;
        }

        username = userDisplayname.username;

        showGymCloseTime = userDisplayname.showGymCloseTime;
        preferredColorTheme = userDisplayname.preferredColorTheme;

        userDisplayname = userDisplayname.displayname;

    } catch (err) {

        console.log("invalid user object");

    }
}

//

//disables body,html scrolling
/*window.addEventListener("scroll", (e) => {

    const test = innerHeight * 0.50;
    //alert(test)

    if (innerWidth < 1024 && window.orientation === 0) {

        e.preventDefault();

        if (pageDom) {

            //const calc = (window.scrollY + pageDom.offsetHeight) - 10;
            const calc = (window.scrollY + pageDom.offsetHeight) + test;

            if (calc > pageDom.scrollHeight) {
                document.body.style.position = "fixed";
                window.scrollTo(0, 0);
            } else {
                document.body.style.position = "";
            }

        }

    }else{
        document.body.style.position = "";
    }

});
*/

window.addEventListener("orientationchange", function () {
    changeBodyPosition();
});


function changeBodyPosition() {
    if (window.orientation === 0 && document.body.style.position === "") {
        document.body.style.position = "fixed";
    } else {
        document.body.style.position = "";
    }
}


function viewUser(viewUser) {

    if (viewUser) {
        sessionStorage.setItem("ViewingUser", viewUser);
        //redirectToUser();
    }

}



window.addEventListener("scroll", (e) => {

    e.preventDefault();

    if (innerWidth <= 1024 && window.orientation === 0) {

        if (pageDom) {

            //const calc = (window.scrollY + pageDom.offsetHeight) - 10;
            const calc = (window.scrollY + pageDom.offsetHeight) + 1;

            if (calc > pageDom.scrollHeight) {
                //document.body.style.position = "fixed";
                window.scrollTo(0, window.scrollY - 5);
            } else {
                //document.body.style.position = "";
            }

        }

    } else {
        document.body.style.position = "";
    }

});

//

//auto redirect to login if token is invalid
window.onload = validateToken;
async function validateToken() {

    if (!window.navigator.onLine) {
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

            } else {
                localStorage.clear();
                sessionStorage.clear();
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

setInterval(() => {
    if (savedWidth !== window.innerWidth) {
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

                    /*
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

// check color theme

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

//

// get new updated user object
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
            }
            else {
                domElement.textContent = "";
            }



        }

    }

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

    location.href = "user.html";

}

function redirectToAccount() {

    location.href = "account.html";

}


//