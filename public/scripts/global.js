// global variables
//var user, token, userDisplayname;

const token = localStorage.getItem("authToken");
const user = localStorage.getItem("user");
let userDisplayname = JSON.parse(user);
userDisplayname = userDisplayname.displayname;

console.log(token)

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

            if (resp) {

                console.log("invalid token");
                localStorage.clear();
                //location.href = "/login.html";
            }
        } else {
            console.log("no token/user, skipped");
            //location.href = "/login.html";
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