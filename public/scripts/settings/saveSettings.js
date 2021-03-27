// update password

async function updatePassword() {

    const exsistingPsw = document.getElementById("exsistingPsw").value;
    const newPsw = document.getElementById("newPsw").value;
    const repeatNewPsw = document.getElementById("repeatNewPsw").value;


    if (exsistingPsw && newPsw && repeatNewPsw) {

        console.log(exsistingPsw);
        console.log(newPsw);
        console.log(repeatNewPsw);

    }
}

//



// update about me

let isUpdatingAboutMe = false;

async function updateAboutMe() {

    if (isUpdatingAboutMe === false) {

        isUpdatingAboutMe = true;

        const gymInp = document.getElementById("gymInp").value;
        const ageInp = document.getElementById("ageInp").value;
        const heightInp = document.getElementById("heightInp").value;
        const weightInp = document.getElementById("weightInp").value;

        const updateSettings = {
            gym: gymInp,
            age: ageInp,
            height: heightInp,
            weight: weightInp
        }

        const body = { "authToken": token, "userInfo": user, "updateSettings": updateSettings };
        const url = `/user/update/settings/about/me`;

        const config = {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        }

        const resp = await fetch(url, config);
        const data = await resp.json();

        document.getElementById("updateAboutMeBtn").innerHTML = data;

        setTimeout(() => {
            location.reload();
        }, 5000);
    }
}

//



// update checkbox settings
let isUpdatingCheckboxSetting = false;

async function updateCheckboxSetting(aSetting, aValue) {

    if (isUpdatingCheckboxSetting === false) {

        isUpdatingCheckboxSetting = true;

        const inputCategory = document.getElementsByClassName("inputCategory");

        for (let i = 0; i < inputCategory.length; i++) {
            inputCategory[i].setAttribute("disabled", true);
        }

        const setting = aSetting;
        const value = aValue;

        const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPI(body, url);

        if (resp === true) {
            //updateUserInfo();
            updateLocalSettings(setting, value);
            loadSetting();
            isUpdatingCheckboxSetting = false;
        }
    }
}

//

async function savePreferredApperance() {

    if (isUpdatingCheckboxSetting === false) {

        isUpdatingCheckboxSetting = true;

        const value = document.getElementById("appearanceThemeSelection").value;
        const setting = "preferredTheme";

        const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPI(body, url);

        if (resp === true) {

            /*const newColorTheme = allowedThemes[value].theme;

            if (newColorTheme !== sessionStorage.getItem("colorTheme") && checkAllowedThemes.includes(newColorTheme) === true) {
                preferredColorTheme = allowedThemes[value].theme;
                sessionStorage.setItem("colorTheme", preferredColorTheme);
                changeColorTheme();
                //lastColorTheme.href = `styles/themes/${preferredColorTheme}.css`;
                //lastColorTheme.id = `themeStyleCSS-${preferredColorTheme}`;
            }*/

            if (value === "0" || value === "1" || value === "2") {
                //sessionStorage.setItem("theme", value);

                if (localStorage.getItem("user")) {
                    localStorage.setItem("theme", value);
                } else {
                    sessionStorage.setItem("theme", value);
                }

                changeColorTheme();
            }

            updateUserInfo();
            //loadSetting();
            //changeColorTheme();
            isUpdatingCheckboxSetting = false;
        }
    }
}


//


//

async function saveColorTheme() {

    if (isUpdatingCheckboxSetting === false) {

        isUpdatingCheckboxSetting = true;

        const value = document.getElementById("themeColorSelection").value;
        const setting = "preferredColorTheme";

        const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPI(body, url);

        if (resp === true) {

            const newColorTheme = allowedThemes[value].theme;

            if (newColorTheme !== localStorage.getItem("colorTheme") || sessionStorage.getItem("colorTheme") && checkAllowedThemes.includes(newColorTheme) === true) {
                preferredColorTheme = allowedThemes[value].theme;
                //sessionStorage.setItem("colorTheme", preferredColorTheme);

                if (localStorage.getItem("user")) {
                    localStorage.setItem("colorTheme", preferredColorTheme);
                } else {
                    sessionStorage.setItem("colorTheme", preferredColorTheme);
                }

                changeColorTheme();
                //lastColorTheme.href = `styles/themes/${preferredColorTheme}.css`;
                //lastColorTheme.id = `themeStyleCSS-${preferredColorTheme}`;
            }

            updateUserInfo();
            //loadSetting();
            //changeColorTheme();
            isUpdatingCheckboxSetting = false;
        }
    }
}

async function saveDisplayname() {
    const displaynameInp = document.getElementById("displaynameInp").value;

    let splitDisplayName = displaynameInp.split(" ");
    let fixedDisplayname = "";

    const letters = /^[A-Za-z0-9 ]+$/;

    if (displaynameInp.match(letters)) {

        for (let i = 0; i < splitDisplayName.length; i++) {

            function upperCaseFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            function lowerCaseAllWordsExceptFirstLetters(string) {
                return string.replace(/\S*/g, function (word) {
                    return word.charAt(0) + word.slice(1).toLowerCase();
                });
            }

            fixedDisplayname += upperCaseFirstLetter(lowerCaseAllWordsExceptFirstLetters(splitDisplayName[i])) + " ";
        }

        // fetch and save etc

    } else {
        alert("Ugyldig visningsnavn!");
    }
}

async function saveUsername() {
    const usernameInp = document.getElementById("usernameInp").value;

    const letters = /^[A-Za-z0-9 ]+$/;

    if (usernameInp.match(letters)) {

        console.log(usernameInp);
    } else {
        alert("Ugyldig brukernavn!");
    }
}

function updateLocalSettings(aSetting, aValue) {

    if (aSetting) {

        const setting = aSetting;
        const value = aValue;

        settings[setting] = value;

        sessionStorage.setItem("userSettings", JSON.stringify(settings));

    } else {
        updateUserInfo();
    }
}