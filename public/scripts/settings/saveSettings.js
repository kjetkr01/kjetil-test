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

async function saveApperanceSettings() {

    if (isUpdatingCheckboxSetting === false) {

        isUpdatingCheckboxSetting = true;

        //const theme = document.getElementById("appearanceThemeSelection").value;
        const colorTheme = document.getElementById("themeColorSelection").value;
        let value = colorTheme;
        let setting = "preferredColorTheme";

        const body = { "authToken": token, "userInfo": user, "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPI(body, url);

        if (resp === true) {

            const lastColorTheme = document.getElementById(`themeStyleCSS-${preferredColorTheme}`);

            const newColorTheme = allowedThemes[value].theme;

            if (newColorTheme !== sessionStorage.getItem("colorTheme") && checkAllowedThemes.includes(newColorTheme) === true) {
                preferredColorTheme = allowedThemes[value].theme;
                sessionStorage.setItem("colorTheme", preferredColorTheme);
                lastColorTheme.href = `styles/themes/${preferredColorTheme}.css`;
                lastColorTheme.id = `themeStyleCSS-${preferredColorTheme}`;
            }

            updateUserInfo();
            //loadSetting();
            //changeColorTheme();
            isUpdatingCheckboxSetting = false;
        }
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