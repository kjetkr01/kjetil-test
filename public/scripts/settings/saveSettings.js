"use strict";
let isUpdatingAboutMe = false,
    isUpdatingCheckboxSetting = false;

// updates password
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
                    showAlert(`Passordet ble endret. Du blir nå logget ut`, true, "redirectToLogin();");
                } else {
                    showAlert(data.message, true);
                }

            } else {
                showAlert("Ønskede passord og gjenta ønskede stemmer ikke", true);
            }

        } else {
            showAlert("Vennligst fyll ut alle feltene", true);
        }
    } else {
        showAlert("Du må ha Internett-tilkobling for å endre passord!", true);
    }
}
// End of updatePassword function

// update about me
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
        showAlert("Du må ha Internett-tilkobling for å endre detaljer om deg!", true);
    }
}
// End of updateAboutMe function

//



// update checkbox settings
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
// End of updateCheckboxSetting function

// savePreferredApperance
async function savePreferredApperance() {
    if (navigator.onLine) {

        isUpdatingCheckboxSetting = true;

        const value = document.getElementById("appearanceThemeSelection").value;
        const setting = "preferredtheme";

        const infoHeader = { "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp === true) {

            if (value !== user.getSetting("preferredtheme")) {
                user.changeSetting(setting, parseInt(value));
                changeColorTheme();
            }
        }
    }
}
// End of savePreferredApperance function


// saveColorTheme
async function saveColorTheme() {
    if (navigator.onLine) {

        isUpdatingCheckboxSetting = true;

        const value = document.getElementById("themeColorSelection").value;
        const setting = "preferredcolortheme";

        const infoHeader = { "updateSetting": setting, "value": value };
        const url = `/user/update/settings/${setting}`;

        const resp = await callServerAPIPost(infoHeader, url);

        if (resp === true) {

            if (value !== user.getSetting("preferredcolortheme") && allowedColorThemes[value]) {
                user.changeSetting(setting, parseInt(value));
                changeColorTheme();
            }
        }
    }
}
// End of saveColorTheme function

// updateBadgeSize
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
// End of updateBadgeSize function

// updateBadgeDetails
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
// End of updateBadgeDetails function

// saveDisplaynameConfirm
async function saveDisplaynameConfirm() {
    if (navigator.onLine) {
        showConfirm("Hvis du endrer visningsnavnet. Må du logge inn på nytt", "saveDisplayname();")
    } else {
        showAlert(`Du må ha Internett-tilkobling for å endre visningsnavn!`, true);
    }
}
// End of saveDisplaynameConfirm function

// saveDisplayname
async function saveDisplayname() {
    if (navigator.onLine) {

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
                showAlert(`Visningsnavet ble endret til: ${fixedDisplayname}. Du blir nå logget ut`, true, "redirectToLogin();");
            } else {
                showAlert(`Visningsnavet kunne ikke bli oppdatert. Vennligst prøv igjen`, true);
            }

        } else {
            showAlert(`Ugyldig visningsnavn!`, true);
        }

    } else {
        showAlert(`Du må ha Internett-tilkobling for å endre visningsnavn!`, true);
    }
}
// End of saveDisplayname function

// saveUsernameConfirm
async function saveUsernameConfirm() {
    if (navigator.onLine) {
        showConfirm("Hvis du endrer brukernavnet. Må du logge inn på nytt", "saveUsername();");
    } else {
        showAlert(`Du må ha Internett-tilkobling for å endre brukernavn!`, true);
    }
}
// End of saveUsernameConfirm function

// saveUsername
async function saveUsername() {
    if (navigator.onLine) {

        const usernameInp = document.getElementById("usernameInp").value;

        const newUsername = usernameInp.toLowerCase();

        const letters = /^[a-z0-9]+$/;

        if (newUsername.match(letters)) {

            const infoHeader = { "newUsername": newUsername };
            const url = `/user/update/username`;

            const resp = await callServerAPIPost(infoHeader, url);

            console.log(resp)

            if (resp === true) {
                localStorage.clear();
                sessionStorage.clear();
                sessionStorage.setItem("cachedUsername", newUsername);
                showAlert(`Brukernavnet ble endret til: ${newUsername}. Du blir nå logget ut`, true, "redirectToLogin();");
            } else {
                showAlert(`Brukernavnet kunne ikke bli endret. Vennligst prøv et annet brukernavn.`, true);
            }

        } else {
            showAlert(`Ugyldig brukernavn!`, true);
        }

    } else {
        showAlert(`Du må ha Internett-tilkobling for å endre brukernavn!`, true);
    }
}
// End of saveUsername function