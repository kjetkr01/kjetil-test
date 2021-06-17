"use strict";
// global variables

const minCharLength = 3,
    maxCharLength = 20;

//

// usage: " validate("My Displayname", "myusername", "mypassword", "mypassword"); "
// validates input
async function validate(displayname, username, password, confirmpassword) {

    let message = "";
    let errorMsg = `må være mellom ${minCharLength} og ${maxCharLength} tegn`;

    if (displayname && username && password && confirmpassword) {

        if (password === confirmpassword) {

            if (displayname.length >= minCharLength && displayname.length <= maxCharLength) {

                if (username.length >= minCharLength && username.length <= maxCharLength) {

                    const letters = /^[A-Za-z0-9]+$/;

                    if (username.match(letters)) {

                        let splitDisplayName = displayname.split(" ");
                        let fixedDisplayname = "";

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

                        const infoHeader = { "authorization": "Basic " + window.btoa(`${username.toLowerCase()}:${password}:${fixedDisplayname}`) };
                        const url = `/access`;

                        const resp = await callServerAPIPost(infoHeader, url);

                        if (resp) {
                            message = resp;//"godkjent";
                        } else {
                            message = errorText;
                        }

                    } else {
                        message = `Brukernavnet kan ikke inneholde mellomrom og kan kun inneholde bokstaver og tall!`;
                    }

                } else {
                    message = `Brukernavnet ${errorMsg}`;
                }

            } else {
                message = `Visningsnavnet ${errorMsg}`;
            }

        } else {
            message = "Passordene stemmer ikke.";
        }

    } else {
        message = "Vennligst fyll ut alle feltene!";
    }

    return message;
}
// End of validate function

// usage: " login("myusername", "mypassword"); "
// login user
async function login(username, password, rmbrMe) {

    let message = "";

    if (username && password) {

        if (username.length >= minCharLength && username.length <= maxCharLength) {

            const infoHeader = { "authorization": "Basic " + window.btoa(`${username}:${password}`) };

            const url = `/authenticate`;

            const resp = await callServerAPIPost(infoHeader, url);

            if (resp) {

                if (resp.authToken && resp.user && resp.user.details && resp.user.settings) {

                    localStorage.clear();
                    sessionStorage.clear();

                    if (rmbrMe === true) {
                        localStorage.setItem("authToken", resp.authToken);
                        localStorage.setItem("user", JSON.stringify(resp.user));
                        localStorage.setItem("userDetails", JSON.stringify(resp.user.details));
                        localStorage.setItem("userSettings", JSON.stringify(resp.user.settings));
                    } else {
                        sessionStorage.setItem("authToken", resp.authToken);
                        sessionStorage.setItem("user", JSON.stringify(resp.user));
                        sessionStorage.setItem("userDetails", JSON.stringify(resp.user.details));
                        sessionStorage.setItem("userSettings", JSON.stringify(resp.user.settings));
                    }

                    message = "Login successful";
                } else {
                    message = "Det har oppstått en feil.";
                }

            } else {
                message = "Brukernavnet eller passordet er feil!";
            }

        } else {
            message = "Brukernavnet eller passordet er feil!";
        }

    } else {
        message = "Vennligst fyll ut alle feltene!";
    }

    return message;
}
// End of login function