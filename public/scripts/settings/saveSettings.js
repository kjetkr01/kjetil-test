// update password
async function updatePassword() {
    if (navigator.onLine) {

        const exsistingPsw = document.getElementById("exsistingPsw").value;
        const newPsw = document.getElementById("newPsw").value;
        const repeatNewPsw = document.getElementById("repeatNewPsw").value;

        if (exsistingPsw && newPsw && repeatNewPsw) {

            if (newPsw === repeatNewPsw) {

                const body = { "authorization": "Basic " + window.btoa(`${exsistingPsw}:${newPsw}`) };
                const url = `/user/update/password`;

                const config = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "authtoken": user.getToken(),
                        "userinfo": JSON.stringify(user.getUser())
                    },
                    body: JSON.stringify(body)
                }

                const response = await fetch(url, config);
                const data = await response.json();

                if (data.status === true) {
                    localStorage.clear();
                    sessionStorage.clear();
                    sessionStorage.setItem("cachedUsername", user.getUsername());
                    alert(`Passordet ble endret. Du blir nå logget ut`);
                    redirectToLogin();
                } else {
                    alert(data.message)
                }

            } else {
                alert("Ønskede passord og gjenta ønskede stemmer ikke");
            }

        } else {
            alert("Vennligst fyll inn alle feltene.");
        }
    } else {
        alert("Du må ha internettforbindelse for å endre passord!");
    }
}

//



// update about me

let isUpdatingAboutMe = false;

async function updateAboutMe() {
    if (navigator.onLine) {

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

            const body = { "updateSettings": updateSettings };
            const url = `/user/update/settings/about/me`;

            const config = {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authtoken": user.getToken(),
                    "userinfo": JSON.stringify(user.getUser())
                },
                body: JSON.stringify(body)
            }

            const resp = await fetch(url, config);
            const data = await resp.json();

            document.getElementById("updateAboutMeBtn").innerHTML = data;

            setTimeout(() => {
                updateUserInfo();
                isUpdatingAboutMe = false;
            }, 2000);
        }
    } else {
        alert("Du må ha internettforbindelse for å endre detaljer om deg!");
    }
}

//



// update checkbox settings
let isUpdatingCheckboxSetting = false;

async function updateCheckboxSetting(aSetting, aValue) {
    if (navigator.onLine) {

        if (isUpdatingCheckboxSetting === false) {

            isUpdatingCheckboxSetting = true;

            const inputCategory = document.getElementsByClassName("inputCategory");

            for (let i = 0; i < inputCategory.length; i++) {
                inputCategory[i].setAttribute("disabled", true);
            }

            const setting = aSetting;
            const value = aValue;

            const infoHeader = { "updateSetting": setting, "value": value };
            const url = `/user/update/settings/${setting}`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {
                user.changeSetting(setting, value);
                setTimeout(() => {
                    loadSetting();
                    isUpdatingCheckboxSetting = false;
                }, 200);

            }
        }
    }
}

//

async function savePreferredApperance() {
    if (navigator.onLine) {

        if (isUpdatingCheckboxSetting === false) {

            isUpdatingCheckboxSetting = true;

            const value = document.getElementById("appearanceThemeSelection").value;
            const setting = "preferredtheme";

            const infoHeader = { "updateSetting": setting, "value": value };
            const url = `/user/update/settings/${setting}`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {

                if (value === "0" || value === "1" || value === "2") {

                    if (localStorage.getItem("user")) {
                        localStorage.setItem("theme", value);
                    } else {
                        sessionStorage.setItem("theme", value);
                    }

                    changeColorTheme();
                }

                user.changeSetting(setting, parseInt(value));

                isUpdatingCheckboxSetting = false;
            }
        }
    }
}


//


//

async function saveColorTheme() {
    if (navigator.onLine) {

        if (isUpdatingCheckboxSetting === false) {

            isUpdatingCheckboxSetting = true;

            const value = document.getElementById("themeColorSelection").value;
            const setting = "preferredcolortheme";

            const infoHeader = { "updateSetting": setting, "value": value };
            const url = `/user/update/settings/${setting}`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp === true) {

                const newColorTheme = allowedThemes[value].theme;

                if (newColorTheme !== localStorage.getItem("colorTheme") || sessionStorage.getItem("colorTheme") && checkAllowedThemes.includes(newColorTheme) === true) {
                    preferredColorTheme = allowedThemes[value].theme;

                    if (localStorage.getItem("user")) {
                        localStorage.setItem("colorTheme", preferredColorTheme);
                    } else {
                        sessionStorage.setItem("colorTheme", preferredColorTheme);
                    }

                    changeColorTheme();
                }

                user.changeSetting(setting, parseInt(value));

                isUpdatingCheckboxSetting = false;
            }
        }
    }
}


async function updateBadgeSize() {
    if (navigator.onLine) {

        const value = document.getElementById("badgeSizeSelection").value;
        const setting = "badgesize";

        const infoHeader = { "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp === true) {
            user.changeSetting(setting, parseInt(value));
            loadSetting();
        }
    }
}

async function updateBadgeDetails() {
    if (navigator.onLine) {
        const value = document.getElementById("badgeDetailsSelection").value;
        const setting = "badgedetails";

        const infoHeader = { "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp === true) {
            user.changeSetting(setting, parseInt(value));
        }
    }
}

async function saveDisplayname() {
    if (navigator.onLine) {

        const confirmSaveDisplayname = confirm("Hvis du endrer visningsnavnet. Må du logge inn på nytt");

        if (confirmSaveDisplayname === true) {

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

                fixedDisplayname = fixedDisplayname.trimRight();

                const infoHeader = { "newDisplayname": fixedDisplayname };
                const url = `/user/update/displayname`;

                const resp = await callServerAPIPost(infoHeader, url);

                if (resp === true) {
                    localStorage.clear();
                    sessionStorage.clear();
                    sessionStorage.setItem("cachedUsername", user.getUsername());
                    alert(`Visningsnavet ble endret til: ${fixedDisplayname}. Du blir nå logget ut`);
                    redirectToLogin();
                } else {
                    alert("Visningsnavet kunne ikke bli oppdatert. Vennligst prøv igjen.")
                }

            } else {
                alert("Ugyldig visningsnavn!");
            }
        }
    } else {
        alert("Du må ha internettforbindelse for å endre visningsnavn!");
    }
}

async function saveUsername() {
    if (navigator.onLine) {

        const confirmSaveUsername = confirm("Hvis du endrer brukernavnet. Må du logge inn på nytt");

        if (confirmSaveUsername === true) {

            const usernameInp = document.getElementById("usernameInp").value;

            const newUsername = usernameInp.toLowerCase();

            const letters = /^[a-z0-9]+$/;

            if (newUsername.match(letters)) {

                const infoHeader = { "newUsername": newUsername };
                const url = `/user/update/username`;

                const resp = await callServerAPIPost(infoHeader, url);

                if (resp === true) {
                    localStorage.clear();
                    sessionStorage.clear();
                    sessionStorage.setItem("cachedUsername", newUsername);
                    alert(`Brukernavnet ble endret til: ${newUsername}. Du blir nå logget ut`);
                    redirectToLogin();
                } else {
                    alert("Brukernavnet er opptatt!")
                }

            } else {
                alert("Ugyldig brukernavn!");
            }
        }
    } else {
        alert("Du må ha internettforbindelse for å endre brukernavn!");
    }
}