// global variables

const minCharLength = 3;
const maxCharLength = 20;

//

// usage: " validate("My Displayname", "myusername", "mypassword", "mypassword"); "
async function validate(displayname, username, password, confirmpassword) {

    let message = "";
    let errorMsg = `må være lengre enn ${minCharLength} tegn og kortere enn ${maxCharLength} tegn`;

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

                        //console.log(fixedDisplayname)

                        const body = { "username": username.toLowerCase(), "password": password, "displayname": fixedDisplayname };
                        const url = `/access`;

                        const resp = await callServerAPI(body, url);

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

// usage: " login("myusername", "mypassword"); "
async function login(username, password, rmbrMe) {

    let message = "";
    let errorMsg = `må være lengre enn ${minCharLength} tegn og kortere enn ${maxCharLength} tegn`;

    if (username && password) {

        if (username.length >= minCharLength && username.length <= maxCharLength) {

            const body = { "authorization": "Basic " + window.btoa(`${username}:${password}`) };

            const url = `/autenticate`;

            const resp = await callServerAPI(body, url);

            if (resp) {

                if (resp.authToken) {

                    localStorage.clear();
                    sessionStorage.clear();

                    if (rmbrMe === true) {
                        localStorage.setItem("authToken", resp.authToken);
                        localStorage.setItem("user", JSON.stringify(resp.user));
                    } else {
                        sessionStorage.setItem("authToken", resp.authToken);
                        sessionStorage.setItem("user", JSON.stringify(resp.user));
                    }

                    const today = new Date();
                    const updatedTxt = today.toLocaleDateString() || true;
                    sessionStorage.setItem("updated", updatedTxt);

                    message = "Login successful";
                } else {
                    message = "Det har oppstått en feil.";
                }

            } else {
                message = "Brukernavnet eller passordet er feil!";
            }

        } else {
            message = `Brukernavnet ${errorMsg}`;
        }

    } else {
        message = "Vennligst fyll ut alle feltene!";
    }

    return message;

}