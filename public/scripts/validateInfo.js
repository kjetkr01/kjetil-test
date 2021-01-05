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

                        const body = { "username": username, "password": password, "displayname": fixedDisplayname };
                        const url = `/access`;

                        const resp = await callServerAPI(body, url);
                        message = resp;//"godkjent";
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
async function login(username, password) {

    let message = "";
    let errorMsg = `må være lengre enn ${minCharLength} tegn og kortere enn ${maxCharLength} tegn`;

    if (username && password) {

        if (username.length >= minCharLength && username.length <= maxCharLength) {

            const body = { "authorization": "Basic " + window.btoa(`${username}:${password}`) };

            const url = `/autenticate`;

            let resp = await callServerAPI(body, url);

            if (resp.authToken) {
                //localstorage / sessionstorage token? resp.authToken
                localStorage.setItem("authToken", resp.authToken);
                localStorage.setItem("user", JSON.stringify(resp.user));
                //localstorage / sessionstorage user object? resp.user
                message = "Login successful";
            } else {
                message = resp;
            }

        } else {
            message = `Brukernavnet ${errorMsg}`;
        }

    } else {
        message = "Vennligst fyll ut alle feltene!";
    }

    return message;

}